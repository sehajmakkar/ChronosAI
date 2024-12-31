import userModel from "../models/user.model.js";

//create user in db
export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: hashedPassword,
  });

  return user;
};
