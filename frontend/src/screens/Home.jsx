import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

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

  return (
    <main className="p-4">
      <div className="projects">
        <button
          className="project p-4 border border-slate-600 rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
          <i className="ri-link ml-1"></i>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Create New Project</h2>
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
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
