import socket from "socket.io-client";
// three functions.
// socket connection
// recieve data
// send data

let socketInstance = null;

export const initializeSocket = (projectId) => {
  socketInstance = socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId
    }
  });

  return socketInstance;
};

export const recieveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
}