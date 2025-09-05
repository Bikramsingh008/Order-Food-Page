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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check email (or role) from payload
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized, login again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default adminAuth;
