import * as projectService from "../services/project.service.js";
import projectModel from "../models/project.model.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";

export const createProject = async (req, res) => {
  // validate before creating
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({
      name,
      userId,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });
    const userId = loggedInUser._id;

    const projects = await projectService.getAllProjectsByUserId({
      userId,
    });

    res.status(200).json({ projects });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });
    const userId = loggedInUser._id;

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId,
    });

    res.status(200).json({ project });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await projectService.getProjectById({ projectId });

    res.status(200).json({ project });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

export const updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, fileTree } = req.body;

    const project = await projectService.updateFileTree({
      projectId,
      fileTree,
    })

    res.status(200).json({ project });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
