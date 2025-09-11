import mongoose from "mongoose";
import { UserService } from "../services/user.service.js";
import { validateUpdateUserSchema } from "../schemas/user.schema.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

export class UserController {

  static getAllUsers = async (req, res) => {
    try {
      const { query, pagination, sort } = req.queryParams;

      const result = await UserService.allUsers({query, pagination, sort})
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static getUserById = async (req, res) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await UserService.userById(id)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static updateUser = async (req, res) => {
    try {
      const { error, value } = validateUpdateUserSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message })
      }
  
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      if ( req.body?.email ) {
        const { email } = req.body
        const repeatedEmail = await UserService.findByEmail(email)
        if ( repeatedEmail && repeatedEmail._id.toString() !== req.params.id ) {
          return res.status(409).json({ error: "Email is already in use" });
        }
      }

      const user = await UserService.userUpdated(id, req.body)
      if ( !user ) {
        return res.status(404).json({message: "User not found"})
      }
  
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const user = await UserService.userDeleted(id)
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
  
      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static uploadProfileImage = async (req, res) => {
    try {
      const { userId } = req.user
      const file = req.file

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'user_profile_images', 
        public_id: `user_${userId}`,
        width: 600,      // Desired width (e.g., 200 pixels)
        height: 600,     // Desired height (e.g., 200 pixels)
        crop: 'fill',
      });

      const imageUrl = result.secure_url;

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      user.profileImageUrl = imageUrl;
      await user.save();

      res.status(200).json({
        message: 'Imagen de perfil actualizada exitosamente',
        imageUrl: imageUrl
      });


    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    }
  }

  static getUserProfileImageById = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('profileImageUrl');

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({ profileImageUrl: user.profileImageUrl || null });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
