import mongoose from "mongoose";
import { FlatService } from "../services/flat.service.js";
import { validateFlatSchema, validateUpdateFlatSchema } from "../schemas/flat.schema.js";
import { Flat } from "../models/flat.model.js";
import cloudinary from "../utils/cloudinary.js";

export class FlatController {

  static getAllFlats = async (req, res) => {
    try {
      const { query, pagination, sort } = req.queryParams;

      const result = await FlatService.getAllFlats({query, pagination, sort})
      res.status(200).json({
        success: true,
        data: result.flats,
        pagination: result.pagination
      });

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static getAllMyFlats = async (req, res) => {
    try {
      const { userId } = req.user
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const page = Math.max(Number(req.query.page) || 1, 1);
      const flats = await FlatService.getAllOwnerFlats({ userId, page })
      
      res.status(200).json(flats);
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static getFlatById = async (req, res) => {
    try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid flat ID" });
      }

      const flat = await FlatService.getFlatById(id)
      if (!flat) {
        return res.status(404).send({ message: "Flat not found" })
      }

      res.status(200).send(flat);

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static addFlat = async(req, res) => {
    try {
      const { error, value } = validateFlatSchema.validate(req.body)
      if (error) {
        return res.status(400).json({message: error.details[0].message})
      }

      const { userId } = req.user
      req.body.ownerId = userId

      const flat = await FlatService.saveFlat(req.body)
      res.status(201).json({message: "Flat created successfully", flat})
      
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static uploadFlatImages = async(req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid flat ID" });
      }

      const files = req.files
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No se han subido archivos.' });
      }

      const flat = await Flat.findOne({ _id: id, deletedAt: null })
      if (!flat) {
        return res.status(404).json({ message: 'Departamento no encontrado.' });
      }

      const uploadedImageUrls = []

      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;

        // Opciones de subida y transformación para Cloudinary
        // Para una galería, quizás quieras dimensiones más grandes o diferentes
        const uploadOptions = {
          folder: `department_images/${id}`, // Carpeta específica para este departamento
          width: 800,      // Ancho deseado
          height: 600,     // Alto deseado
          crop: 'fill',    // Rellena las dimensiones, recortando el exceso
          quality: 'auto:good', // Optimiza la calidad
        };

        const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
        uploadedImageUrls.push(result.secure_url);
      }

      flat.images.push(...uploadedImageUrls)
      await flat.save();

      res.status(200).json({
        message: 'Imágenes subidas exitosamente y añadidas al departamento.',
        imageUrls: uploadedImageUrls,
        departmentImages: flat.images // Opcional: devuelve todas las imágenes del departamento
      });

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static updateFlat = async(req, res) => {
    try {
      const { error, value } = validateUpdateFlatSchema.validate(req.body)
      if (error) {
        return res.status(400).json({message: error.details[0].message})
      }
      
      const { id } = req.params;
      const flat = await FlatService.updateFlat(id, req.body)
      if ( !flat ) {
        return res.status(404).json({message: "Flat not found"})
      }
      
      res.status(201).json(flat)
  
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  static deleteFlat = async (req, res) => {
    try {
      const { id } = req.params
      const flat = await FlatService.deleteFlat(id)
      
      if ( !flat ) {
        return res.status(404).json({message: "Flat not found"})
      }
  
      res.status(200).json({ message: "Flat deleted successfully", flat });

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

}

