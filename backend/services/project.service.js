import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name || !userId) {
    throw new Error("All fields are required");
  }

  const project = await projectModel.create({
    name,
    users: [userId],
  });

  return project;
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) {
    throw new error("UserID are required");
  }

  const projects = await projectModel.find({ users: userId });

  return projects;
};
