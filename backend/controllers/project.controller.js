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
  try {
    const { projectId, fileTree } = req.body;
    
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.fileTree = fileTree;
    project.lastUpdated = new Date();
    await project.save();

    res.status(200).json({ message: 'FileTree updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addMessage = async (req, res) => {
  try {
    const { projectId, message, sender } = req.body;
    
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // each message was saving (no. of collaborators) times in the db
    const isDuplicate = project.messages.some(
      existingMsg => 
        existingMsg.message === message &&
        existingMsg.sender._id === sender._id &&
        // Check if messages are within 1 second of each other
        Math.abs(new Date(existingMsg.timestamp) - new Date()) < 1000
    );

    if (!isDuplicate) {
      project.messages.push({ sender, message });
      await project.save();
      res.status(200).json({ message: 'Message added successfully' });
    } else {
      res.status(200).json({ message: 'Duplicate message not added' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Sort messages by timestamp before sending
    const sortedMessages = project.messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.status(200).json({ messages: sortedMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};