import React, { useState, useEffect } from 'react';
import { MessageSquareCode, Users, Zap, ArrowRight, Github, Brain } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import {User, LogOut} from 'lucide-react'

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    // logout pe axios se call..
    try{
      localStorage.removeItem('token');
      console.log('Logout successful');
    } catch (err) {
      console.log(err);
    }
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    /// check if user if logged in or not
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950 overflow-x-hidden">
      {/* Hide scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header/Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/5' : ''
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
              <Zap className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">ChronosAI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="home" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Projects</a>
              <a href="contact" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition">Contact</a>
              <a href="about" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition">About</a>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="px-4 py-2 bg-cyan-500 text-sm font-medium text-black rounded-lg hover:bg-cyan-400 transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Side - Text Content */}
            <div className="flex flex-col justify-center pt-32 lg:pt-40 ml-20 mb-20 ">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Code Chat and Collaborate with ChronosAI
              </h1>
              <p className="text-xl text-cyan-200 mb-8 leading-relaxed max-w-lg">
                Experience the future of collaborative coding with AI-powered assistance.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/home')} className="px-8 py-4 bg-cyan-500 text-black text-base font-semibold rounded-lg hover:bg-cyan-400 transition flex items-center">
                  Create a Project <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-black/30 backdrop-blur-sm border border-cyan-500/30 text-white text-base font-semibold rounded-lg hover:bg-black/50 transition flex items-center">
                  <Github className="mr-2 w-5 h-5" /> GitHub
                </button>
              </div>
            </div>

            {/* Right Side - Spline Model */}
            <div className="relative h-[600px] lg:h-screen mr-10">
              <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
              {/* with spline logo and colors, link: https://prod.spline.design/uU9o4wHq1IVf7csq/scene.splinecode */}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
              <MessageSquareCode className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Instant Project Setup</h3>
              <p className="text-base text-gray-300">One command is all it takes. Get complete project structures and boilerplate code instantly, tailored to your vision.</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
              <Brain className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
              <p className="text-base text-gray-300">Your personal AI developer is available 24/7 for code reviews, suggestions, and problem-solving guidance.</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
              <Users className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Real-time Collaboration</h3>
              <p className="text-base text-gray-300">Chat, code, and create together. Our real-time collaboration features make team development seamless.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-cyan-950">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-lg font-bold text-white">ChronosAI</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition">Privacy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition">Terms</a>
                <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;