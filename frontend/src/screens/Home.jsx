import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log(projectName);

    axios
      .post("/projects/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
        setProjectName("");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        //console.log(res.data);
        setProjects(res.data.projects);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
        <button
          className="project p-4 border border-slate-600 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
          <i className="ri-link"></i>
        </button>

        {projects.map((project) => (
          <div
            onClick={() => {
              navigate(`/project`, {
               state: project 
              })
            }}
            className="project p-6 border border-slate-300 rounded-lg cursor-pointer flex flex-col gap-4 min-w-[200px] bg-white hover:bg-indigo-50 hover:shadow-lg transition-all duration-200"
            key={project._id}
          >
            <h2 className="font-semibold text-lg flex items-center justify-between">
              {project.name}
              <i className="ri-arrow-right-up-line text-gray-500"></i>
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <i className="ri-group-fill"></i>
              <p>Collaborators: {project.users.length}</p>
            </div>
          </div>
        ))}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Create New Project
              </h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter project name"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
