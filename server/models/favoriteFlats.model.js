import mongoose from "mongoose";

const favoriteFlatSchema = new mongoose.Schema({
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'flats',
      required: [true, 'Flat ID is required'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
    },
    createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

favoriteFlatSchema.index({ userId: 1, flatId: 1 }, { unique: true });

export const FavoriteFlat = mongoose.model("favoriteFlats", favoriteFlatSchema)

