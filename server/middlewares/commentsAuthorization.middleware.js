import mongoose from "mongoose"
import { FlatService } from "../services/flat.service.js"
import { CommentService } from "../services/comments.service.js"

export class AuthorizationMiddleware {

  static usersAllowedToComment = async (req, res, next) => {
      
    try {
      const { flatId } = req.params
      const senderId = req.user?.userId
      const { content, parentId, rating } = req.body

      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(flatId)) {
        return res.status(400).json({ error: "Invalid user or flat ID" });
      }

      if ( parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ error: "Invalid comment ID" });
      }

      const flat = await FlatService.getFlatById(flatId)
      if (!flat) {
        return res.status(404).send({ message: "Flat not found" })
      }

      if (!parentId) {
        req.comment = {
          flatId,
          senderId, 
          content: content.trim(),
          rating, 
          parentId: null, 
        }
        return next()
      } 

      const parentComment = await CommentService.getCommentById(parentId)
      
      if (!parentComment) {
        return res.status(404).json({ message: 'Comentario padre no encontrado' })
      }

      const isUserAllowedComment = parentComment.senderId.toString() === senderId.toString()
      const isFlatOwner = flat.ownerId._id.toString() === senderId.toString()

      if (!isUserAllowedComment && !isFlatOwner) {
        return res.status(403).json({ message: "You are not authorized to reply to this comment" });
      }

      req.comment = {
        flatId,
        senderId,
        content: content.trim(),
        parentId,
      };

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static flatOwnerCommentsMiddleware = async (req, res, next) => {
      const { flatId } = req.params
      const { userId } = req.user
    
      try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(flatId)) {
          return res.status(400).json({ error: "Invalid user or flat ID" });
        }

        const flat = await FlatService.getFlatById(flatId)
          if (!flat) {
            return res.status(404).send({ message: "Flat not found" })
          }
          
          // if (flat.ownerId._id.toString() !== userId.toString()) {
          //   return res.status(403).json({ message: "Access denied for User" })
          // }

          next()
      } catch (error) {
        return res.status(403).json({ message: "Access denied for User" })
      }
    
  }

  static userOwnerMessages = async (req, res, next) => {
    const { userId } = req.user
    const userIdParams = req.params.userId

    if (!mongoose.Types.ObjectId.isValid(userIdParams)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    if (userIdParams != userId) {
      return res.status(403).json({ message: "Access denied for User" })
    }

    next()
  }
}