import mongoose from "mongoose";
import { Flat } from "../models/flat.model.js";
import { User } from "../models/user.model.js";
import { FavoriteFlat } from "../models/favoriteFlats.model.js";
import { Comment } from "../models/comments.model.js";

export class FlatService {

  static getAllFlats = async ({query, pagination, sort}) => {
    const flats = await Flat.find(query)
      .collation({ locale: 'es', strength: 1 }) // orden insensible a mayuculas y minusculas
      .populate("ownerId", "firstName lastName email profileImageUrl deletedAt")
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
    
    const filteredFlats = flats.filter(flat => flat.ownerId && flat.ownerId.deletedAt === null)

    const allFlats = await Flat.find(query)
      .populate("ownerId", "deletedAt")
      .lean();
    const validFlatsCount = allFlats.filter(flat => flat.ownerId && flat.ownerId.deletedAt === null).length;

    return {
      flats: filteredFlats,
      pagination: {
        total: validFlatsCount,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(validFlatsCount / pagination.limit),
        hasMore: pagination.page * pagination.limit < validFlatsCount
      }
    }
  }

  static getAllOwnerFlats = async ({ userId, page }) => {
    const limit = 10
    const skip = (page - 1) * limit

    const flats = await Flat.find({ ownerId: userId, deletedAt: null })
      .sort({ createdAt: -1 })  
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Flat.countDocuments({ ownerId: userId, deletedAt: null })

      return {
        flats,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total
        }
      };
  }

  static getFlatById = async ( flatId ) => {
    const flat = await Flat.findOne({ _id: flatId, deletedAt: null })
      .populate("ownerId", "firstName lastName email deletedAt")
      .lean()
    
    if (!flat || flat.ownerId?.deletedAt != null) {
      return null
    } 
    return flat
  }

  static saveFlat = async (flatToSave) => {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      const flat = new Flat(flatToSave)
      await flat.save({ session })

      const { ownerId } = flatToSave
      const user = await User.findByIdAndUpdate(
        ownerId, 
        { $inc: { flatsCounter: 1 } },
        { session, new: true }
      )

      if (!user) {
        throw new Error("Owner not found");
      }

      await session.commitTransaction()
      return flat.toObject()

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  static updateFlat = async (flatId, flatToUpdate) => {
    flatToUpdate.updatedAt = Date.now();

    const flat = await Flat.findOneAndUpdate(
      { _id: flatId, deletedAt: null },
      flatToUpdate,
      { new: true, runValidators: true }
    ).populate("ownerId", "firstName lastName email deletedAt").lean();

    if (!flat || flat.ownerId?.deletedAt != null) {
      return null;
    }
    
    return flat;
  }

  static deleteFlat = async ( flatId ) => {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const flat = await Flat.findOneAndUpdate(
        { _id: flatId, deletedAt: null }, 
        { deletedAt: new Date() }, 
        { new: true, runValidators: true, session }
      ).populate("ownerId", "firstName lastName email deletedAt").lean()
      
      if (!flat || flat.ownerId?.deletedAt != null) {
        throw new Error("Flat not found or owner deleted");
      }

      const ownerId  = flat.ownerId._id
      const user = await User.findByIdAndUpdate(
        ownerId, 
        { $inc: { flatsCounter: -1 } },
        { session, new: true }
      )

      if (!user) {
        throw new Error("Owner not found");
      }

      await FavoriteFlat.deleteMany(
        {flatId: flatId}
      ).session(session)

      await Comment.deleteMany(
        { flatId : flatId }
      ).session(session)
      
      await session.commitTransaction()
      return flat;

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      session.endSession();
    }
  }

}

