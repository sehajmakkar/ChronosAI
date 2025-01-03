import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";

const Project = () => {
  const location = useLocation();
  // console.log(location.state);

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
    axios.put("/projects/add-user", {
      projectId: location.state._id,
      users: Array.from(selectedUserId),
    }).then((res) => {
      console.log(res);
      setModalOpen(false);
    }).catch((err) => {
      console.log(err.response.data);
    });
  }
  
  useEffect(() => {
    
    axios.get(`/projects/get-project/${location.state._id}`)
    .then((res) => {
      console.log(res.data.project);
      setProject(res.data.project);

    }).catch((err) => {

    });


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

        <div className="conversation-area flex-grow flex flex-col">
          <div className="message-box flex-grow flex flex-col p-2 gap-1">
            <div className="incoming max-w-56 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-50 text-xs">example@gmail.com</small>
              <p className="text-sm">
                Hello, how are you? Lorem ipsum dolor sit.
              </p>
            </div>
            <div className="outgoing max-w-56 ml-auto flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-50 text-xs">example@gmail.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit.
              </p>
            </div>
          </div>

          <div className="input-field w-full flex">
            <input
              type="text"
              placeholder="Enter message..."
              className="p-2 px-4 border-none outline-none flex-grow"
            />
            <button className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
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
            {project.users && project.users.map((user, index) => (
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
                  addCollaborators()
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
