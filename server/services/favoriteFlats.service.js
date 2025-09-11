import { FavoriteFlat } from "../models/favoriteFlats.model.js";

export class FavoriteFlatService {
  
  static addFlat = async (flatToSave) => {
    const favoriteFlat = new FavoriteFlat(flatToSave)
    await favoriteFlat.save()
    return favoriteFlat.toObject()
  }

  static getFavoriteFlat = async ({flatId, userId}) => {
    const favoriteFlat = await FavoriteFlat.findOne({ flatId, userId }).lean()
  
    if (!favoriteFlat) {
      return null
    }

    return favoriteFlat
  }

  static deleteFlat = async (favoriteFlatId) => {
    await FavoriteFlat.deleteOne({ _id: favoriteFlatId })
  }

  static getOwnerFavoriteFlats = async ({ userId, page }) => {
    const limit = 10
    const skip = (page - 1)* limit

    const favoriteFlats = await FavoriteFlat.find({ userId })
      .populate({
        path: 'flatId',
        populate: {
          path: 'ownerId',
          select: 'firstName lastName email'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await FavoriteFlat.countDocuments({ userId })
    
    return {
      favoriteFlats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    }

  }
}