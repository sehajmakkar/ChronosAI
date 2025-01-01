import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowecase: true,
    minLength: [4, "Email must be at least 4 characters long"],
    maxLength: [32, "Email must be at most 32 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// method for hashing password
userSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// method for comparing password
// this.password is undefined in arrow functions annd this points to the password in the lexical scope, so use simple functions.
userSchema.methods.comparePassword = async function (password) {
  console.log("isCompare mein hu");
  return await bcrypt.compare(password, this.password);
};

// method for generating jwt
userSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      // _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const User = mongoose.model("user", userSchema);

export default User;
