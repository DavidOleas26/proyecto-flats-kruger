import mongoose from "mongoose";
import bcrypt from "bcrypt";

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const validateBirthdate = (birthdate) => {
  const currentDate = new Date()
  const minYear = new Date( currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDay() )
  return birthdate <= minYear
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: [2, 'First name must have at least 2 characters'],
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    minlength: [2, 'Last name must have at least 2 characters'],
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email address`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  birthdate: {
    type: Date,
    validate: {
      validator: validateBirthdate,
      message: props => `The user must be at least 18 years old.`
    },
    required: [true, 'Birthdate is required'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be "user" or "admin".'
    },
    default: "user",
  },
  flatsCounter: {
    type: Number,
    min: [0, "The number of flats can not be less than zero"],
    default: 0
  },
   profileImageUrl: {
    type: String,
    default: 'https://res.cloudinary.com/dmf95fj1h/image/upload/v1750035130/profile_nsu0qw.png'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  const validationResult = await bcrypt.compare(password, this.password);
  return validationResult;
};

export const User = mongoose.model("users", userSchema);
