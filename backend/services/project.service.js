import mongoose from "mongoose";

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

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("ProjectID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("ProjectID is invalid");
  }

  if (!users) {
    throw new Error("Users are required");
  }

  if (
    !Array.isArray(users) ||
    users.some((user) => !mongoose.Types.ObjectId.isValid(user))
  ) {
    throw new Error("Users are invalid");
  }

  if (!userId) {
    throw new Error("UserID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("UserID is invalid");
  }

  //console.log(userId)

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  //console.log(project)

  if (!project) {
    throw new Error("User is not a member of this project");
  }


  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: {
          $each: users,
        },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;

};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("ProjectID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("ProjectID is invalid");
  }

  const project = await projectModel.findById(projectId).populate("users");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
  }

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) {
    throw new Error("ProjectID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("ProjectID is invalid");
  }

  if (!fileTree) {
    throw new Error("File tree is required");
  }

  const project = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      fileTree,
    },
    {
      new: true,
    } 
  )

  return project;
};
