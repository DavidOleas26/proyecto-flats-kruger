import mongoose from "mongoose"
import { FavoriteFlatService } from "../services/favoriteFlats.service.js"
import { FlatService } from "../services/flat.service.js"

export class FavoritesFlatsController {

  static addFavoriteFlat = async (req, res) => {
    try {
      const { flatId } = req.params
      const { userId } = req.user

      if (!mongoose.Types.ObjectId.isValid(flatId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid flat or user ID" });
      }

      const flat = await FlatService.getFlatById(flatId)
      if (!flat || flat.deletedAt != null) {
        return res.status(404).json({ message: "Flat not found" });
      }

      const flatToSave = {
        flatId: flatId,
        userId: userId
      }

      const favoriteFlat = await FavoriteFlatService.addFlat(flatToSave)
      res.status(201).json(favoriteFlat)

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static removeFavoriteFlat = async (req, res) => {
    try {
      const { flatId } = req.params;
      const { userId } = req.user;

      if (!mongoose.Types.ObjectId.isValid(flatId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid flat or user ID" });
      }

      const favoriteFlat = await FavoriteFlatService.getFavoriteFlat({ flatId, userId })
      if (!favoriteFlat) {
        return res.status(404).json({ message: "Favorite flat not found" });
      }

      await FavoriteFlatService.deleteFlat(favoriteFlat._id)
      res.status(200).json({ message: "Favorite flat removed successfully" });

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static getAllFavoriteFlats = async (req, res) => {
    try {
      const { userId } = req.user
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid flat or user ID" });
      }

      const page = Math.max(Number(req.query.page) || 1 ,1)
      const favoriteFlats= await FavoriteFlatService.getOwnerFavoriteFlats({ userId, page })
      if (favoriteFlats.length === 0) {
        return res.status(404).json({ message: "No favorite flats found" });
      }

      res.status(200).json(favoriteFlats);

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }
}

