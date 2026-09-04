import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import validator from "validator"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const createToken = (id) => {
    const jwtSecret = (process.env.JWT_SECRET || "bikramsingh08").trim();
    return jwt.sign({ id }, jwtSecret);
}

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone || "", 
          address: user.address || "",
          gender: user.gender || "male",
          avatarUrl: user.avatarUrl || ""
        }
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route for user Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, gender } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }

    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    if (!cleanEmail.endsWith("@gmail.com")) {
      return res.status(400).json({ success: false, message: "Email address must end with @gmail.com (e.g. user@gmail.com)" });
    }

    const exists = await userModel.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ 
      name: name.trim(), 
      email: cleanEmail, 
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      gender: gender || "male",
      avatarUrl: ""
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone || "", 
        address: user.address || "",
        gender: user.gender || "male",
        avatarUrl: user.avatarUrl || ""
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route for Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@forever.com").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "qwerty123").trim();
    const jwtSecret = (process.env.JWT_SECRET || "bikramsingh08").trim();

    if (
      email && password &&
      email.trim() === adminEmail &&
      password.trim() === adminPassword
    ) {
      const token = jwt.sign(
        { email: adminEmail, role: "admin" },
        jwtSecret,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        token,
        user: { name: "Admin", email: adminEmail, role: "admin" }
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, avatarUrl, newPassword } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender) user.gender = gender;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "male",
        avatarUrl: user.avatarUrl || ""
      }
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route for Admin List Users with Order Aggregation Stats
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password').sort({ createdAt: -1 });
    const orders = await orderModel.find({});

    const usersWithStats = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId && o.userId.toString() === u._id.toString());
      const totalSpent = userOrders.reduce((acc, o) => acc + (o.amount || 0), 0);
      const lastOrderDate = userOrders.length > 0 ? userOrders[0].date : null;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || "N/A",
        address: u.address || "N/A",
        gender: u.gender || "male",
        createdAt: u.createdAt || u._id.getTimestamp(),
        orderCount: userOrders.length,
        totalSpent,
        lastOrderDate,
        recentOrders: userOrders.map((o) => ({
          orderId: o._id,
          amount: o.amount,
          status: o.status,
          date: o.date,
          itemCount: o.items ? o.items.length : 0
        }))
      };
    });

    res.json({ success: true, users: usersWithStats });
  } catch (error) {
    console.log("Error fetching user list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, listUsers };