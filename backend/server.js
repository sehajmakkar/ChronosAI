import "dotenv/config.js";
import http from "http";
import app from "./app.js";
import {Server} from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// auth middleware for socket.io
io.use(async (socket,next) => {
  try{

    const token = socket.handshake.auth?.token || (socket.handshake.headers.authorization && socket.handshake.headers.authorization?.split(" ")[1]);

    // console.log(token);

    const projectId = socket.handshake.query.projectId;

    if(!mongoose.Types.ObjectId.isValid(projectId)){
      return next(new Error("Invalid ProjectId"));
    }

    socket.project = await projectModel.findById(projectId);


    if(!token) {
      return next(new Error("Auth error"));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return next(new Error("Auth error"));
    }

    socket.user = decoded;

    next();


  }catch(err){
    next(err);
  }
})

io.on('connection', socket => {

  socket.roomId = socket.project._id.toString();

  console.log('a user connected');
  // console.log(projectId)

  // jaise hi user connect hoga , particular room pe join hoga apne aap.
  socket.join(socket.roomId);
  // event to send data to other users in the room
  socket.on('project-message', async data => {

    // ai response when the message contains @ai
    const message = data.message;
    const aiIsPresentInMessage = message.includes("@ai")
    socket.broadcast.to(socket.roomId).emit('project-message', data);
    
    if(aiIsPresentInMessage){
      
      const prompt = message.replace("@ai ","");
      const result = await generateResult(prompt);

      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          _id: "ai",
          email: "ChronosAI"
        }
      });

      return;
    }

    console.log(data);
  })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { 
    console.log('user disconnected');
    socket.leave(socket.roomId);
   });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});