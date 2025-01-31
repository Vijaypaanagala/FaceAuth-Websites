import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    },
    
  
  password: {
    type: String,
    required: true
    },
    
  
  faceDescriptor: {
    type: [Number],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && (arr.length === 128 || arr.length === 512);
      },
      message: "Face descriptor must have exactly 128 or 512 numeric values",
    },
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
