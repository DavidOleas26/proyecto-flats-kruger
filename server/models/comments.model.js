import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  flatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'flats',
    required: [true, 'Flat ID is required'],
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Sender ID is required'],
  },
  content: {
    type: String,
    maxlength: [500, 'Comments must have a maximum of 500 characters'],
    required: [true, 'Comment is required'],
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es obligatoria.'],
    min: [1, 'La calificación mínima es 1.'],
    max: [5, 'La calificación máxima es 5.']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments',
    default: null, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

export const Comment = mongoose.model("comments", commentSchema)