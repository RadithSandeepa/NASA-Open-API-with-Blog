import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const providerSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 character!"],
    maxLength: [32, "Name cannot exceed 32 character!"],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: (value) => !value || validator.isEmail(value),
      message: "Please provide a valid email!",
    },
    required: function () {
      return !this.providers?.length;
    },
  },
  phone: {
    type: String,
    default: null,
    required: function () {
      return !this.providers?.length;
    },
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"],
    default: "Author",
  },
  password: {
    type: String,
    minLength: [8, "Password must contain at least 8 character!"],
    maxLength: [32, "Password cannot exceed 32 character!"],
    select: false,
    required: function () {
      return !this.providers?.length;
    },
  },
  providers: {
    type: [providerSchema],
    default: [],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
