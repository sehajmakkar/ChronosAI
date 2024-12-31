import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await userService.createUser({ email, password });

    const token = await user.generateJwt();

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
