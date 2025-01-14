import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/users/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      console.log(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950 flex items-center justify-center px-4">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Zap className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-white">ChronosAI</span>
        </div>

        {/* Main Form */}
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
          <p className="text-gray-400 mb-6">Start your journey with ChronosAI</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-500/20 rounded-lg
                          text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 
                          transition-all duration-300"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-500/20 rounded-lg
                          text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 
                          transition-all duration-300"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Feature highlights */}
            <div className="py-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <span>AI-powered code analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <span>Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                <span>Advanced project management</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-lg 
                      hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;