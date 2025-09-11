import mongoose from "mongoose";

const validateYearBuilt = (yearBuilt) => {
  const currentDate = new Date()
  return yearBuilt <= currentDate
}

const validateDateAvailable = (dateAvailable) => {
  const currentDate = new Date()
  return dateAvailable >= currentDate
}

const flatSchema = new mongoose.Schema({
  city: {
    type: String,
    minlength: [2, 'City name must have at least 2 characters'],
    required: [true, 'City name is required'],
  },
  streetName: {
    type: String,
    minlength: [1, 'City name must have at least 1 character'],
    required: [true, 'Street name is required'],
  },
  streetNumber: {
    type: Number,
    min: [0, "Street Number can not be less than zero"],
    required: [true, 'Street number is required'],
  },
  areaSize: {
    type: Number,
    min: [0, "Area size can not be less than zero"],
    required: [true, 'Area size is required'],
  },
  hasAc: {
    type: Boolean,
    required: [true, 'Ac is required'],
  },
  yearBuilt: {
    type: Date,
    validate: {
      validator: validateYearBuilt,
      message: props => `The year of construction cannot be later than the current date.`
    },
    required: [true, 'Year of construction is required'],
  },
  description: {
    type: String,
    maxlength: [1000, 'La descripción no puede superar los 1000 caracteres'],
    trim: true
  },
  rentPrice: {
    type: Number,
    min: [0, "Rent price can not be  less than 0"],
    required: [true, 'Rent Price is required'],
  },
  dateAvailable : {
    type: Date,
    validate: {
      validator: validateDateAvailable,
      message: props => `Available dates cannot be earlier than the current date.`
    },
    required: [true, 'Date Available is required'],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  images: [{ 
    type: String
  }],
  createdAt : {
    type: Date,
    default: Date.now,
  },
  updatedAt : {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null,
  },
})

export const Flat = mongoose.model("flats", flatSchema)