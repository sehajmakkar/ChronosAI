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

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
// You can use any available theme

import { getWebContainer } from "../config/webContainer";

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
      await axios.post('/projects/messages', {
        projectId: project._id,
        message,
        sender: user
      });

      // Only send through socket after successful save
      sendMessage('project-message', {
        message,
        sender: user,
        timestamp: new Date() // Adding timestamp to help identify unique messages
      });

      setMessages(prevMessages => [...prevMessages, { sender: user, message }]);
      setMessage('');
    } catch (err) {
      console.error('Error saving message:', err);
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
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }
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
            contents: content.file.contents
          }
        };
      }
      
      // Mount the files
      await webContainer.mount(files);
  
      // Wait a moment for files to be properly mounted
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // Install dependencies
      console.log('Installing dependencies...');
      const installProcess = await webContainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log('Install output:', chunk);
          }
        })
      );
      
      // Wait for install to complete
      const installExit = await installProcess.exit;
      
      if (installExit !== 0) {
        throw new Error('npm install failed');
      }

      if(runProcess) {
        runProcess.kill();
      }
  
      // Run the application
      console.log('Starting application...');
      let tempRunProcess = await webContainer.spawn('npm', ['start']);
      tempRunProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log('Run output:', chunk);
          }
        })
      );

      setRunProcess(tempRunProcess);

      webContainer?.on('server-ready', (port,url) => {
        console.log(port,url)
        setIframeURL(url);
      })
  
    } catch (error) {
      console.error('Error in mountAndRunFiles:', error);
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
        console.log(fileTree)
        console.log(err)
      });
  }

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        initializeSocket(project._id);

        if (!webContainer) {
          const container = await getWebContainer();
          setWebContainer(container);
          console.log('container created');
        }

        // Load existing messages
        const messagesResponse = await axios.get(`/projects/messages/${project._id}`);
        setMessages(messagesResponse.data.messages);

        // Load project details including fileTree
        const projectResponse = await axios.get(`/projects/get-project/${project._id}`);
        console.log(projectResponse.data.project);
        setProject(projectResponse.data.project);
        if (projectResponse.data.project.fileTree) {
          setFileTree(projectResponse.data.project.fileTree);
        }

        // Socket message handler
        recieveMessage('project-message', async (data) => {
          let messageContent = data.message;
          let fileTreeData = null;

          try {
            const parsedMessage = JSON.parse(data.message);
            messageContent = parsedMessage.text || data.message;
            
            if (parsedMessage.fileTree) {
              fileTreeData = parsedMessage.fileTree;
              webContainer?.mount(fileTreeData);
              setFileTree(fileTreeData);
              
              // Save fileTree to database when received from AI
              try {
                await axios.put('/projects/update-file-tree', {
                  projectId: project._id,
                  fileTree: fileTreeData
                });
              } catch (err) {
                console.error('Error saving fileTree:', err);
              }
            }
          } catch (error) {
            messageContent = data.message;
          }

          // DONT Save received message to database, ONLY SHOW IN UI, ONLY SAVE SENT MESSAGES IN DB!
          // try {
          //   await axios.post('/projects/messages', {
          //     projectId: project._id,
          //     message: messageContent,
          //     sender: data.sender
          //   });
          // } catch (err) {
          //   console.error('Error saving message:', err);
          // }

          setMessages(prevMessages => [
            ...prevMessages,
            { message: messageContent, sender: data.sender }
          ]);
        });
      } catch (error) {
        console.error('Error loading project data:', error);
      }
    };

    loadProjectData();
  }, []);

  return (
    <main className="h-screen w-screen flex">
      <section className="left flex flex-col h-full min-w-80  bg-slate-200">
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
          className="conversation-area flex-grow flex flex-col overflow-y-auto p-2 scrollbar-hide"
          ref={messageBox}
        >
          <div className="message-box flex flex-col gap-3">
            {messages.map((message, index) => {
              const isOutgoing = message.sender._id === user._id;
              const isAIMessage = message.sender._id === "ai";
              return (
                <div
                  key={index}
                  className={`message max-w-64 flex flex-col p-3 rounded-md shadow-md break-words ${
                    isOutgoing
                      ? "max-w-60 bg-green-100 text-green-800 self-end"
                      : isAIMessage
                      ? "bg-gray-800 text-white self-start max-w-md"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  <small className="opacity-75 text-xs">
                    {message.sender.email}
                  </small>
                  <p className="text-sm">
                    {message.sender._id === "ai"
                      ? writeAiMessage(message.message)
                      : message.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="input-field w-full flex">
          <input
            type="text"
            placeholder="Use @ai to ask AI..."
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

      <section className="right bg-slate-200 h-full flex-grow flex ">
        <div className="explorer h-full min-w-52 bg-slate-700 overflow-y-auto">
          <h2 className="p-4 text-lg font-semibold bg-gray-900 shadow-md text-white">
            File Explorer
          </h2>

          <div className="file-tree w-full p-2">
            {fileTree && Object.keys(fileTree).map((file, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentFile(file);
                    setOpenFiles([...new Set([...openFiles, file])]);
                  }}
                  className="tree-element cursor-pointer p-2 px-4 m-1 flex items-center gap-2 rounded-md bg-slate-200  hover:bg-slate-300"
                >
                  <p className="font-semibold text-lg">{file}</p>
                </button>
              );
            })}
          </div>
        </div>


          <div className="code-editor flex flex-col flex-grow h-full max-w-full">
            <div className="tabs-container h-14 min-h-[56px] bg-gray-100">
              <div className="tabs-scroll-area flex overflow-x-auto whitespace-nowrap p-2 no-scrollbar justify-between">
                <div className="files flex">
                {openFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`tab flex-shrink-0 flex items-center gap-2 px-4 py-2 mr-2 rounded-md ${
                      currentFile === file
                        ? "bg-slate-950 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      onClick={() => setCurrentFile(file)}
                      className="cursor-pointer"
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
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                ))}
                </div>
                <div className="actions flex gap-2">
                  <button
                  className="run px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={async () => {
                    if (!webContainer || !fileTree) {
                      console.error('WebContainer or fileTree not available');
                      return;
                    }
                    await mountAndRunFiles(webContainer, fileTree);
                  }}
                  >
                    RUN
                  </button>
                </div>
              </div>
            </div>

            <div className="bottom flex flex-grow p-2 overflow-hidden">
              <div className="code-editor-area h-full overflow-auto flex-grow ">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none"
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

                      // setFileTree((prevFileTree) => ({
                      //   ...prevFileTree,
                      //   [currentFile]: {
                      //     ...prevFileTree[currentFile],
                      //     file: {
                      //       ...prevFileTree[currentFile]?.file,
                      //       contents: updatedContent,
                      //     },
                      //   },
                      // }));

                    }}
                    dangerouslySetInnerHTML={{
                      __html: currentFile && fileTree[currentFile]?.file?.contents 
                        ? highlightCode(fileTree[currentFile].file.contents, currentFile)
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

          {iFrameURL && webContainer && (
            <div className="flex min-w-72 flex-col h-full ">
              <div className="addressBar">
                <input type="text"
                className="w-full p-2 px-4 bg-slate-900 text-white outline-none"
                value={iFrameURL}
                onChange={(e) => setIframeURL(e.target.value)}
                />
              </div>
              <iframe
              src={iFrameURL}
              title="WebContainer"
              className="w-full h-full"
            >
              </iframe>
            </div>


          )}
        
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
