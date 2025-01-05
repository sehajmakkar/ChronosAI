import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  recieveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../context/user.context";

// npm library used to convert markdown to jsx as we get response from AI in markdown mostly.
import Markdown from "markdown-to-jsx";

const Project = () => {
  const location = useLocation();
  // console.log(location.state);

  const { user } = useContext(UserContext);
  console.log(user);

  const [panel, setPanel] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState([]); // State for selected user ID

  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state);

  // Predefined default images
  const defaultImages = [
    "bulba1.jpg",
    "bulba1234.jpg",
    "bulba3.jpg",
    "bulba4.jpg",
  ];

  // Assign random images to users
  const userImages = users.map(
    (_, index) => defaultImages[index % defaultImages.length]
  );

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);

      // Toggle selection
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id); // Unselect
      } else {
        newSelectedUserId.add(id); // Select
      }
      //console.log(newSelectedUserId);
      return Array.from(newSelectedUserId);
    });
  };

  //console.log(selectedUserId);

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res);
        setModalOpen(false);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  const [message, setMessage] = useState("");
  function send() {
    // client to server to the particular room in which user is present.
    sendMessage("project-message", {
      message,
      // sender from userContext
      sender: user,
    });

    appendOutgoingMessage(message);

    setMessage("");
  }

  const messageBox = React.createRef();
  function appendIncomingMessage(messageObject) {
    const messageBox = document.querySelector(".message-box");
    const message = document.createElement("div");
    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-blue-100", // Light blue for incoming messages
      "text-blue-800", // Dark blue text for better contrast
      "w-fit",
      "rounded-md",
      "shadow-sm" // Subtle shadow for a clean look
    );
    message.innerHTML = `
      <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
      <p class='text-sm'>${messageObject.message}</p>
    `;
    messageBox.appendChild(message);
  }
  
  function appendOutgoingMessage(message) {
    const messageBox = document.querySelector(".message-box");
    const newMessage = document.createElement("div");
    newMessage.classList.add(
      "ml-auto",
      "max-w-56",
      "message",
      "flex",
      "flex-col",
      "p-2",
      "bg-green-100", // Light green for outgoing messages
      "text-green-800", // Dark green text for contrast
      "w-fit",
      "rounded-md",
      "shadow-sm" // Subtle shadow for aesthetic
    );
    newMessage.innerHTML = `
      <small class='opacity-65 text-xs'>${user.email}</small>
      <p class='text-sm'>${message}</p>
    `;
    messageBox.appendChild(newMessage);
    scrollToBottom();
  }
  
  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  useEffect(() => {
    initializeSocket(project._id);
    recieveMessage("project-message", (data) => {
      console.log(data);
      appendIncomingMessage(data);
    });

    axios
      .get(`/projects/get-project/${location.state._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
      })
      .catch((err) => {});

    axios
      .get("/users/all")
      .then((res) => {
        console.log(res);
        setUsers(res.data.allUsers);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  return (
    <main className="h-screen w-screen flex">
      <section className="left flex flex-col h-full min-w-80 bg-slate-200">
        <header className="flex w-full justify-between p-2 px-4 bg-slate-100 items-center">
          <button className="flex gap-2" onClick={() => setModalOpen(true)}>
            <i className="ri-add-fill"></i>
            <p>Add Collaborators</p>
          </button>

          <button className="p-2" onClick={() => setPanel(true)}>
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div
          className="conversation-area flex-grow flex flex-col overflow-y-auto p-2"
          ref={messageBox}
        >
          <div className="message-box flex flex-col gap-1">
            {/* Message cards will be dynamically appended here */}
          </div>
        </div>

        <div className="input-field w-full flex">
          <input
            type="text"
            placeholder="Enter message..."
            className="p-2 px-4 border border-gray-300 rounded-l-md flex-grow outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="px-5 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            onClick={send}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>

        {/* side panel */}
        <div
          className={`sidePanel fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform ${
            panel ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
          style={{ width: "300px" }}
        >
          <div className="p-4 flex justify-between items-center bg-slate-100">
            <h2 className="text-lg font-bold">Collaborators</h2>
            <button onClick={() => setPanel(false)} className="text-lg">
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div
            className="p-4"
            style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          >
            {/* side panel ki mapping */}
            {project.users &&
              project.users.map((user, index) => (
                <div
                  key={user._id}
                  className={`flex items-center p-2 rounded-md mb-2 shadow-sm ${
                    selectedUserId === user._id
                      ? "bg-blue-300"
                      : "bg-slate-200 hover:bg-slate-300"
                  } transition-colors duration-200`}
                >
                  <img
                    src={userImages[index]}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Add Collaborators</h2>
            <ul
              className="space-y-2 mb-6"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {users.map((user, index) => (
                <li
                  key={user._id}
                  className={`flex items-center p-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 ${
                    selectedUserId.includes(user._id)
                      ? "bg-blue-300"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleUserClick(user._id)} // Directly call the function
                >
                  <img
                    src={userImages[index]}
                    alt="User"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium">{user.email}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add logic to handle adding collaborators here
                  addCollaborators();
                  console.log("Add as collaborator clicked");
                  setModalOpen(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add as Collaborator
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
