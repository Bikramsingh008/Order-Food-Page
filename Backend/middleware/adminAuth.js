import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token, please login again" });
    }

    const token = authHeader.split(" ")[1]; // remove "Bearer"
    const jwtSecret = (process.env.JWT_SECRET || "bikramsingh08").trim();
    const decoded = jwt.verify(token, jwtSecret);

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@forever.com").trim();

    // Check email or role from payload
    if (decoded.role !== "admin" && decoded.email !== adminEmail) {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized, login again" });
    }

    next();
  } catch (error) {
    console.log("Admin Auth Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default adminAuth;
