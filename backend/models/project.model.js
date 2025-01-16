import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    _id: String,
    email: String
  },
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: [true, "Project name must be unique"],
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }
  ],

  fileTree: {
    type: Object, 
    default: {}
  },

  messages: [messageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },

});

const Project = mongoose.model("project", projectSchema);

export default Project;