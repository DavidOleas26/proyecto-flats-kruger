import { Comment } from "../models/comments.model.js";

export class CommentService{
  static saveComment = async (commentToSave) => {
    const comment = await new Comment(commentToSave).save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('senderId', 'firstName lastName profileImageUrl')
      .lean();

    return populatedComment;
  }
  
  static getCommentById = async (commentId) => {
    const comment = await Comment.findOne({ _id: commentId}).lean()
    if (!comment) {
      return false
    }
    return comment
  }
  
  static getAllComments = async (flatId) => {
      // const comments = await Comment.find({ flatId, parentId: null })
      const comments = await Comment.find({ flatId })
        .sort({ createdAt: -1 }) // Ordena del más reciente al más antiguo
        .populate('senderId', 'firstName lastName profileImageUrl')
        .lean();
  
        // .populate({
        //   path: 'flatId',
        //   select: 'ownerId',
        //   populate: {
        //     path: 'ownerId',
        //     select: 'firstName lastName email'
        //   }
        // })

      // for (let comment of comments) {
      //   comment.replies = await Comment.find({ parentId: comment._id })
      //   .populate('senderId', 'email')
      //   .lean();
      // }
      return comments;
  }

    static getAllUserComments = async (senderId) => {
      // const comments = await Comment.find({ senderId, parentId: null })
      const comments = await Comment.find({ senderId })
        .populate({
          path: 'flatId',
          select: 'ownerId',
          populate: {
            path: 'ownerId',
            select: 'firstName lastName email'
          }
        })
        .populate( 'senderId', 'firstName lastName email' )
        .lean();
  
      // for (let comment of comments) {
      //   comment.replies = await Comment.find({ parentId: comment._id })
      //   .populate('senderId', 'email')
      //   .lean();
      // }
  
      return comments;
  }

}


