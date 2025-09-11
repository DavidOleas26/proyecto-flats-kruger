import mongoose from "mongoose";
import { Flat } from "../models/flat.model.js";

export class AuthorizationMiddleware {
  
  static flatOwnerMiddleware = async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid flat ID" });
    }
  
    try {
      const flat = await Flat.findOne({ _id: id, deletedAt: null }).select('ownerId');
        if (!flat) {
          return res.status(404).send({ message: "Flat not found" })
        }
        
        if (flat.ownerId.toString() !== userId.toString()) {
          return res.status(403).json({ message: "Access denied for User" })
        }

        next()
    } catch (error) {
      return res.status(403).json({ message: "Access denied for User" })
    }
  
  }

}