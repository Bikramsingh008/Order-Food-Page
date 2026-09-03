import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Not authorized, please log in again" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, please log in again" });
        }

        const jwtSecret = (process.env.JWT_SECRET || "bikramsingh08").trim();
        const token_decode = jwt.verify(token, jwtSecret);
        if (token_decode && token_decode.id) {
            req.body.userId = token_decode.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: "Invalid session token, please log in again" });
        }
    } catch (error) {
        console.log("Auth Middleware Error:", error.message);
        return res.status(401).json({ success: false, message: "Session expired or invalid token" });
    }
};

export default userAuth;
