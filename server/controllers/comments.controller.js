import { CommentService } from "../services/comments.service.js"
import { validateCommentSchema } from "../schemas/comment.schema.js"

export class CommentController {
  static createComment = async (req, res) => {
  
    try {
      const { error, value } = validateCommentSchema.validate(req.comment)
      if (error) {
        return res.status(400).json({message: error.details[0].message})
      }

      const comment = await CommentService.saveComment(req.comment)
      res.status(201).json({ message: "review created successfully", comment })
  
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }
  
  static getAllCommentsOwner = async (req, res) => {
    try {
      
      const { flatId } = req.params;
      const comments = await CommentService.getAllComments(flatId);
      res.status(200).json(comments);
  
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static getUserMessages = async (req, res) => {
    try {
      
      const {userId} = req.params
      const comments = await CommentService.getAllUserComments(userId);
      res.status(200).json(comments);

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }
  
}
