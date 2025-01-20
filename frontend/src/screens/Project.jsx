import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  recieveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../context/user.context";

import {
  MessageSquare,
  Users,
  Zap,
  Play,
  X,
  Send,
  ChevronRight,
} from "lucide-react";

// npm library used to convert markdown to jsx as we get response from AI in markdown mostly.
import Markdown from "markdown-to-jsx";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
// You can use any available theme

import { getWebContainer } from "../config/webContainer";

import { GradientButton } from "@/components/ui/gradient-button";
import { MagnetizeButton } from "@/components/ui/magnetize-button";

const Project = () => {
  const location = useLocation();
  // console.log(location.state);

  const { user } = useContext(UserContext);
  console.log(user);

  const [panel, setPanel] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState([]); // State for selected user ID

  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state || {});

  const [messages, setMessages] = useState([]);

  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);

  const [iFrameURL, setIframeURL] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

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

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await axios.get("/users/all");
      console.log(response.data);
      const filteredUsers = response.data.allUsers.filter(
        (u) =>
          u._id !== user._id && !project.users?.some((pu) => pu._id === u._id)
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      fetchUsers();
    }
  }, [modalOpen]);

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
  const send = async () => {
    // Save message to database first
    try {
      await axios.post("/projects/messages", {
        projectId: project._id,
        message,
        sender: user,
      });

      // Only send through socket after successful save
      sendMessage("project-message", {
        message,
        sender: user,
        timestamp: new Date(), // Adding timestamp to help identify unique messages
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: user, message },
      ]);
      setMessage("");
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  const messageBox = React.createRef();

  function writeAiMessage(message) {
    try {
      // Try to parse as JSON first
      const msgObject = JSON.parse(message);
      return (
        <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
          <Markdown>{msgObject.text}</Markdown>
        </div>
      );
    } catch (error) {
      // If parsing fails, treat as plain text
      return (
        <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
          <Markdown>{message}</Markdown>
        </div>
      );
    }
  }

  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTextAreaChange = (e) => {
    setFileTree({
      ...fileTree,
      [currentFile]: {
        file: {
          ...fileTree[currentFile].file,
          contents: e.target.value,
        },
      },
    });
  };

  const getLanguageFromFileName = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const extensionToLanguage = {
      js: "javascript",
      jsx: "javascript",
      py: "python",
      html: "html",
      css: "css",
      json: "json",
      // Add more mappings as needed
    };
    return extensionToLanguage[extension] || "plaintext";
  };

  const highlightCode = (content, fileName) => {
    if (!content) return "";
    try {
      const language = getLanguageFromFileName(fileName);
      return hljs.highlight(content, { language }).value;
    } catch (error) {
      console.error("Highlighting error:", error);
      return content; // Return unhighlighted content as fallback
    }
  };

  async function mountAndRunFiles(webContainer, fileTree) {
    try {
      // First, mount all files from fileTree to the webContainer
      const files = {};
      for (const [filename, content] of Object.entries(fileTree)) {
        files[filename] = {
          file: {
            contents: content.file.contents,
          },
        };
      }

      // Mount the files
      await webContainer.mount(files);

      // Wait a moment for files to be properly mounted
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Install dependencies
      console.log("Installing dependencies...");
      const installProcess = await webContainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("Install output:", chunk);
          },
        })
      );

      // Wait for install to complete
      const installExit = await installProcess.exit;

      if (installExit !== 0) {
        throw new Error("npm install failed");
      }

      if (runProcess) {
        runProcess.kill();
      }

      // Run the application
      console.log("Starting application...");
      let tempRunProcess = await webContainer.spawn("npm", ["start"]);
      tempRunProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("Run output:", chunk);
          },
        })
      );

      setRunProcess(tempRunProcess);

      webContainer?.on("server-ready", (port, url) => {
        console.log(port, url);
        setIframeURL(url);
      });
    } catch (error) {
      console.error("Error in mountAndRunFiles:", error);
    }
  }

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(fileTree);
        console.log(err);
      });
  }

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        initializeSocket(project._id);

        // if (!webContainer) {
        //   const container = await getWebContainer();
        //   setWebContainer(container);
        //   console.log("container created");
        // }

        // Load existing messages
        const messagesResponse = await axios.get(
          `/projects/messages/${project._id}`
        );
        setMessages(messagesResponse.data.messages);

        // Load project details including fileTree
        const projectResponse = await axios.get(
          `/projects/get-project/${project._id}`
        );
        console.log(projectResponse.data.project);
        setProject(projectResponse.data.project);
        if (projectResponse.data.project.fileTree) {
          setFileTree(projectResponse.data.project.fileTree);
        }

        // Socket message handler
        recieveMessage("project-message", async (data) => {
          let messageContent = data.message;
          let fileTreeData = null;

          try {
            const parsedMessage = JSON.parse(data.message);
            messageContent = parsedMessage.text || data.message;

            if (parsedMessage.fileTree) {
              fileTreeData = parsedMessage.fileTree;
              // webContainer?.mount(fileTreeData);
              setFileTree(fileTreeData);

              // Save fileTree to database when received from AI
              try {
                await axios.put("/projects/update-file-tree", {
                  projectId: project._id,
                  fileTree: fileTreeData,
                });
              } catch (err) {
                console.error("Error saving fileTree:", err);
              }
            }
          } catch (error) {
            messageContent = data.message;
          }

          // Save AI message to database
          try {
            if (data.sender._id === "ai") {
              await axios.post("/projects/messages", {
                projectId: project._id,
                message: messageContent,
                sender: {
                  _id: "ai",
                  email: "ChronosAI",
                },
              });
            }
          } catch (err) {
            console.error("Error saving AI message:", err);
          }

          setMessages((prevMessages) => [
            ...prevMessages,
            { message: messageContent, sender: data.sender },
          ]);
        });
      } catch (error) {
        console.error("Error loading project data:", error);
      }
    };

    loadProjectData();
  }, []);

  return (
    <main className="h-screen w-screen flex bg-slate-950">
      {/* Left Section */}
      <section className="left flex flex-col h-full min-w-80 bg-slate-900 border-r border-cyan-900/30">
        <header className="flex w-full justify-between p-3 px-4 bg-slate-800/50 items-center border-b border-cyan-900/30">
          <button
            className="flex gap-2 items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            onClick={() => setModalOpen(true)}
          >
            <Users size={18} />
            <p className="text-sm font-medium">Add Collaborators</p>
          </button>

          <button
            className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            onClick={() => setPanel(true)}
          >
            <MessageSquare size={18} />
          </button>
        </header>

        <div
          className="conversation-area max-w-96 flex-grow flex flex-col overflow-y-auto p-3 scrollbar-hide"
          ref={messageBox}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="message-box flex flex-col gap-3">
            {messages.map((message, index) => {
              const isOutgoing = message.sender._id === user._id;
              const isAIMessage = message.sender._id === "ai";

              return (
                <div
                  key={index}
                  className={`message flex flex-col p-3 rounded-lg shadow-lg break-words transition-all duration-300 hover:shadow-cyan-900/20 animate-fadeIn
                    ${isOutgoing
                      ? "bg-cyan-900/30 text-cyan-100 ml-auto" 
                      : isAIMessage
                        ? "bg-slate-800 text-slate-100 mr-auto border border-cyan-900/20"
                        : "bg-slate-800/50 text-slate-200 mr-auto border border-slate-700"
                    }
                    ${isOutgoing ? "items-end" : "items-start"}
                    max-w-[75%]`}
                >
                  <small className="opacity-75 text-xs font-medium mb-1">
                    {message.sender.email}
                  </small>
                  <div className={`text-sm leading-relaxed ${isOutgoing ? "text-right" : "text-left"}`}>
                    {message.sender._id === "ai"
                      ? writeAiMessage(message.message)
                      : message.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="input-field w-full flex p-3 bg-slate-900/50 border-t border-cyan-900/30">
          <input
            type="text"
            placeholder="Use @ai to ask AI..."
            className="p-2 px-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-l-lg flex-grow outline-none focus:border-cyan-600 transition-colors duration-200 placeholder:text-slate-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="px-5 bg-cyan-600 text-white rounded-r-lg hover:bg-cyan-500 transition-colors duration-200 flex items-center justify-center"
            onClick={send}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Side Panel */}
        <div
          className={`sidePanel fixed top-0 left-0 h-full bg-slate-900 shadow-xl z-50 transform ${
            panel ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 ease-in-out border-r border-cyan-900/30`}
          style={{ width: "300px" }}
        >
          <div className="p-4 flex justify-between items-center bg-slate-800/50 border-b border-cyan-900/30">
            <h2 className="text-lg font-bold text-cyan-100 uppercase">
              {project.name}
            </h2>
            <button
              onClick={() => setPanel(false)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="p-4"
            style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          >
            {project.users &&
              project.users.map((user, index) => (
                <div
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg mb-2 shadow-lg ${
                    selectedUserId === user._id
                      ? "bg-cyan-900/30 text-cyan-100"
                      : "bg-slate-800/50 text-slate-200 hover:bg-slate-800 border border-slate-700"
                  } transition-all duration-200`}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg=="
                    alt="User"
                    className="w-10 h-10 p-1 rounded-full mr-3 border-2 border-cyan-600"
                  />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="right bg-slate-950 h-full flex-grow flex">
        <div className="explorer h-full min-w-52 bg-slate-900 border-r border-cyan-900/30">
          <h2 className="p-4 text-lg font-semibold bg-slate-800/50 text-cyan-100 border-b border-cyan-900/30 flex items-center gap-2">
            <Zap size={18} className="text-cyan-400" />
            File Explorer
          </h2>

          <div
            className="file-tree w-full p-2 space-y-1 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {fileTree &&
              Object.keys(fileTree).map((file, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentFile(file);
                    setOpenFiles([...new Set([...openFiles, file])]);
                  }}
                  className="tree-element w-full cursor-pointer p-2.5 flex items-center gap-2 rounded-lg 
                  bg-gradient-to-r from-slate-800/50 to-slate-800/30 text-slate-200 
                  hover:from-cyan-900/20 hover:to-slate-800/50 
                  border border-transparent hover:border-cyan-900/30 
                  transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 w-full">
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-200"
                    />
                    <p className="font-medium text-sm truncate">{file}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full max-w-full">
          <div className="tabs-container h-14 min-h-[56px] bg-slate-900 border-b border-cyan-900/30">
            <div className="tabs-scroll-area flex overflow-x-auto whitespace-nowrap p-2 no-scrollbar justify-between">
              <div className="files flex gap-2">
                {openFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`tab flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentFile === file
                        ? "bg-cyan-900/30 text-cyan-100"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => setCurrentFile(file)}
                      className="cursor-pointer text-sm"
                    >
                      {file}
                    </span>
                    <button
                      onClick={() => {
                        const updatedFiles = openFiles.filter(
                          (openFile) => openFile !== file
                        );
                        setOpenFiles(updatedFiles);
                        setCurrentFile(
                          updatedFiles.length > 0 ? updatedFiles[0] : null
                        );
                      }}
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {/* <div className="actions flex gap-2">
        <div className="relative group">
          <GradientButton variant="variant" className="px-2 py-2 text-sm font-medium">
            Preview
          </GradientButton>
          <div className="invisible group-hover:visible absolute z-50 -bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-2 px-3 rounded shadow-lg whitespace-nowrap">
            Coming soon!
          </div>
        </div>
      </div> */}
            </div>
          </div>

          <div className="bottom flex flex-grow p-2 overflow-hidden">
            <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-900 rounded-lg">
              <pre className="hljs h-full p-4">
                <code
                  className="hljs h-full outline-none text-slate-200"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const updatedContent = e.target.innerText;
                    const ft = {
                      ...fileTree,
                      [currentFile]: {
                        file: {
                          contents: updatedContent,
                        },
                      },
                    };
                    setFileTree(ft);
                    saveFileTree(ft);
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      currentFile && fileTree[currentFile]?.file?.contents
                        ? highlightCode(
                            fileTree[currentFile].file.contents,
                            currentFile
                          )
                        : "",
                  }}
                  style={{
                    whiteSpace: "pre-wrap",
                    paddingBottom: "25rem",
                    counterSet: "line-numbering",
                  }}
                />
              </pre>
            </div>
          </div>
        </div>

        {/* {iFrameURL && webContainer && (
          <div className="flex min-w-72 flex-col h-full border-l border-cyan-900/30">
            <div className="addressBar bg-slate-900">
              <input
                type="text"
                className="w-full p-2 px-4 bg-slate-800 text-slate-200 outline-none border-b border-cyan-900/30"
                value={iFrameURL}
                onChange={(e) => setIframeURL(e.target.value)}
              />
            </div>
            <iframe
              src={iFrameURL}
              title="WebContainer"
              className="w-full h-full bg-white"
            />
          </div>
        )} */}

      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-96 border border-cyan-900/30 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-cyan-100">
              Add Collaborators
            </h2>
            <ul
              className="space-y-2 mb-6 scrollbar-hide"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {users.map((user, index) => (
                <li
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedUserId.includes(user._id)
                      ? "bg-cyan-900/30 text-cyan-100"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                  }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <img
                    src={userImages[index]}
                    alt="User"
                    className="w-8 h-8 rounded-full mr-3 border-2 border-cyan-600"
                  />
                  <span className="text-sm font-medium">{user.email}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addCollaborators();
                  setModalOpen(false);
                }}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
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
