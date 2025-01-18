import React from 'react';
import { Github, Twitter, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {User, LogOut} from 'lucide-react'
import { useState } from 'react';

const Contact = () => {
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

      {/* Contact Content */}
      <div className="container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">Get in Touch</h1>
          <p className="text-xl text-cyan-200 mb-12 text-center">
            Have questions about ChronosAI? We'd love to hear from you.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black/50 border border-cyan-500/20 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 bg-black/50 border border-cyan-500/20 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Message</label>
                  <textarea
                    className="w-full p-3 bg-black/50 border border-cyan-500/20 rounded-lg text-white focus:border-cyan-500 focus:outline-none h-32"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button className="w-full px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                  Send Message
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white mb-2">Connect with us</h2>
              <div className="grid gap-6">
                <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition group">
                  <a href="https://github.com/sehajmakkar/ChronosAI" className="flex items-center space-x-6">
                    <Github className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
                      <p className="text-gray-300">
                        Check out our open source projects and contribute to the future of AI-powered development.
                      </p>
                    </div>
                  </a>
                </div>

                <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-xl hover:border-cyan-500/40 transition group">
                  <a href="https://x.com/sehajmakkarr" className="flex items-center space-x-6">
                  <i class="ri-twitter-x-fill w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform"></i>
                    {/* <Twitter className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform" /> */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">X</h3>
                      <p className="text-gray-300">
                        Follow us for the latest updates, features, and community highlights.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-950 mt-20">
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

export default Contact;