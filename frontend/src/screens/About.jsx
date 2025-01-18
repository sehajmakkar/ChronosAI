import React from 'react';
import { Zap, Code2, Blocks, Brain, Rocket, Users, MessageSquareCode, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {User, LogOut} from 'lucide-react'
import { useState } from 'react';

const About = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

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

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950">
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

      {/* About Content */}
      <div className="container mx-auto px-4 pt-32">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">Revolutionizing the Future of Coding</h1>
          <p className="text-xl text-cyan-200 leading-relaxed">
            ChronosAI is your ultimate AI-powered coding companion, transforming how developers work, 
            collaborate, and bring ideas to life.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            We envision a future where coding is more accessible, efficient, and collaborative. 
            ChronosAI serves as your dedicated junior software engineer, helping you transform ideas 
            into reality with unprecedented speed and precision. By combining cutting-edge AI with 
            intuitive collaboration tools, we're not just building a platform—we're creating the 
            future of software development.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
            <Blocks className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Instant Project Setup</h3>
            <p className="text-gray-300">
              One command is all it takes. Get complete project structures and boilerplate code instantly, 
              tailored to your vision.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
            <Brain className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
            <p className="text-gray-300">
              Your personal AI developer is available 24/7 for code reviews, suggestions, and 
              problem-solving guidance.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
            <Users className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Collaboration</h3>
            <p className="text-gray-300">
              Chat, code, and create together. Our real-time collaboration features make team 
              development seamless.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose ChronosAI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/40 transition">
              <Rocket className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Boost Productivity</h3>
              <p className="text-gray-300">
                Reduce setup time by 90% and focus on what matters most—building great software.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/40 transition">
              <MessageSquareCode className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Smart Code Analysis</h3>
              <p className="text-gray-300">
                Get intelligent suggestions and real-time code analysis for better quality code.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/40 transition">
              <Shield className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Enterprise-Ready</h3>
              <p className="text-gray-300">
                Built with security and scalability in mind, ready for teams of any size.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/40 transition">
              <Code2 className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Advanced AI Models</h3>
              <p className="text-gray-300">
                Powered by state-of-the-art language models for accurate code understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Development Workflow?</h2>
          <p className="text-xl text-cyan-200 mb-8">
            Join thousands of developers who are already building the future with ChronosAI.
          </p>
          <button 
            onClick={() => navigate('/register')} 
            className="px-8 py-4 bg-cyan-500 text-black text-lg font-semibold rounded-lg hover:bg-cyan-400 transition"
          >
            Get Started Today
          </button>
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
  );
};

export default About;