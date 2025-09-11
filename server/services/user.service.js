import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Flat } from "../models/flat.model.js";
import { FavoriteFlat } from "../models/favoriteFlats.model.js";
import { Comment } from "../models/comments.model.js";

export class UserService {

  static allUsers = async ({query, pagination, sort}) => {
    const users = await User.find(query)
      .collation({ locale: 'es', strength: 1 }) // orden insensible a mayuculas y minusculas
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .select('-password');
    
    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
        hasMore: pagination.page * pagination.limit < total
      }
    };
  }

  static userById = async (id) => {
    const user = await User.findOne({ _id: id, deletedAt: null }).lean();
    if (!user) {
      return null
    }
    delete user.password
    return user
  }

  static findByEmail = async (userEmail) => {
    const user = await User.findOne({ email: userEmail, deletedAt: null });
    if (!user) {
      return null
    }
    return user
  }

  static saveUser = async (userToSave) => {
    const user = new User(userToSave)
    await user.save()
    const userObj = user.toObject();
    delete userObj.password
    return userObj
  }

  static userUpdated = async (id, userToSave) => {
    userToSave.updatedAt = new Date();

    const existingUser = await User.findOne({ _id: id, deletedAt: null })
    if (!existingUser) {
      return null
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      userToSave, 
      { new: true, runValidators: true }
    ).lean()

    if (!updatedUser) {
      return null
    }

    delete updatedUser.password
    return updatedUser
  }

  static userDeleted = async (id) => {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      const user = await User.findOneAndUpdate(
        {_id: id, deletedAt: null},
        { deletedAt: new Date() },
        { new: true, runValidators: true, session }
      ).select('-password').lean()

      if (!user) {
        throw new Error("User not found");
      }

      await Flat.updateMany(
        { ownerId: id, deletedAt: null },
        { deletedAt: new Date() },
        { session }
      );

      await FavoriteFlat.deleteMany(
        {userId: id}
      ).session(session)

      await Comment.deleteMany(
        { senderId : id }
      ).session(session)

      await session.commitTransaction();
      return user 

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
