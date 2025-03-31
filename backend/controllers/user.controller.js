import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
// import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await userService.createUser({ email, password });

    const token = await user.generateJwt();

    delete user._doc.password; // nahi toh password show hoga frontend mein console mein user mein
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  // validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // you have to explicitely select the password cuz in schema password is hidden, i.e. if you find any user by email it will not return password
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }
    // console.log(user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // console.log("djbjkdnlck");

    const token = await user.generateJwt();

    delete user._doc.password;
    res.status(200).json({ user, token });
  } catch (error) {
    // console.log("idhar hai error");
    res.status(500).json({ error: error.message });
  }
};

export const ProfileController = async (req, res) => {
  console.log(req.user);
  res.status(200).json({
    user: req.user,
  });
};

// export const logoutController = async (req, res) => {
//   try {
//     const token =
//       req.cookies.token ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     redisClient.set(token, "logout", "EX", 60 * 60 * 24);

//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const getAllUsersController = async (req, res) => {
  try {

    // hume isme vo user nahi chahiye jo loggedIn hai
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const allUsers = await userService.getAllUsers({ userId })

    res.status(200).json({ allUsers });

  } catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

