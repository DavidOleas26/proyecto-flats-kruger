import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";

const authenticationMiddleware = async(req, res, next) => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Access denied. Token not provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, configs.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.userId, deletedAt: null }).lean();
    if (!user) {
      return res.status(401).json({ error: "Authentication failed. User not found." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authenticationMiddleware;
