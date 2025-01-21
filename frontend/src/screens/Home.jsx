import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { Users, Plus, ArrowUpRight, FolderPlus, X, Loader2 } from 'lucide-react';
import {showError, showSuccess} from "../config/toast";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  async function createProject(e) {
    e.preventDefault();
    setIsCreating(true);
    try {
      await axios.post("/projects/create", { name: projectName });
      setIsModalOpen(false);
      setProjectName("");
      fetchProjects();
    } catch (err) {
      showError("Refresh the page and try again..");
      console.log(err.response.data);
    } finally {
      setIsCreating(false);
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all");
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950">
      {/* Custom scrollbar style */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>

      <div className="container mx-auto px-8 py-16 max-w-7xl">
        {/* Header with subtle animation */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Your Projects
          </h1>
          <p className="text-cyan-200 text-lg">
            Create and manage your collaborative coding projects
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* New Project Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group h-[180px] bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/40 hover:transform hover:scale-102 transition-all duration-300"
            >
              <div className="p-4 bg-cyan-500/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                <FolderPlus className="w-7 h-7 text-cyan-400" />
              </div>
              <span className="text-lg font-medium text-white group-hover:text-cyan-200 transition-colors">
                Create New Project
              </span>
            </button>

            {/* Project Cards */}
            {projects.map((project, index) => (
              <div
                key={project._id}
                onClick={() => navigate('/project', { state: project })}
                className="group h-[180px] bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 cursor-pointer hover:border-cyan-500/40 hover:transform hover:scale-102 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                    {project.name}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="mt-auto flex items-center text-cyan-200/70">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-base">{project.users.length} Collaborators</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal remains the same */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-black/90 border border-cyan-500/20 rounded-xl p-8 max-w-md w-full mx-4 animate-scale-up">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={createProject}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-cyan-200 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/20 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter project name"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-black/50 border border-cyan-500/20 text-cyan-200 rounded-lg hover:bg-black/70 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all duration-300 flex items-center"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-up {
          animation: scale-up 0.2s ease-out forwards;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Home;