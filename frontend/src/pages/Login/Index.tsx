import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSpinner, FaDiscord, FaTimes, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';

// Import background image for the login page
import loginBackground from '../../assets/slider/slider3.jpg';

const LoginPage: React.FC = () => {
  const [formMode, setFormMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState({ type: '', message: '' });
  const [awaitingReset, setAwaitingReset] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setResetMessage({ type: '', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      setIsSubmitting(false);
      return;
    }
    
    const url = formMode === 'register'
      ? `/api/users/register`
      : `/api/users/login`;
      
    try {
      const response = await axios.post(url, formData);
      if (formMode === 'register') {
        setFormMode('login');
        setFormData({ ...formData, password: '' });
        setResetMessage({ 
          type: 'success', 
          message: 'Registration successful! Please login with your credentials.' 
        });
      } else {
        localStorage.setItem('token', response.data.token);
        // Redirect to home page or dashboard
        navigate('/');
        window.location.reload(); // Refresh to update auth state
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        if (error.response.status === 403) {
          setError('Account awaiting admin approval.');
        } else if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid username or password.');
        } else if (error.response.status === 409) {
          setError('Username already exists. Please choose another.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setResetMessage({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    
    try {
      setAwaitingReset(true);
      setResetMessage({ type: '', message: '' });
      
      await axios.post(`/api/users/resetPassword`, { email });
      
      setResetMessage({ 
        type: 'success', 
        message: `Password reset instructions sent to ${email}. Please check your inbox.` 
      });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setResetMessage({ type: 'error', message: 'Email not found. Please try again.' });
      } else {
        setResetMessage({ type: 'error', message: 'Failed to reset password. Please try again later.' });
      }
    } finally {
      setAwaitingReset(false);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = `/api/discord/auth`;
  };

  return (
    <DefaultLayout
      title={formMode === 'forgot-password' ? "Reset Password" : formMode === 'register' ? "Create Account" : "Login"}
      subtitle={formMode === 'forgot-password' ? "It happens..." : formMode === 'register' ? "Join the community!" : "Welcome back!"}
      backgroundImage={loginBackground}
      metaDescription="Sign in to your Spoekle.com account or create a new account to access all features."
    >
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/85 dark:bg-neutral-800/85 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_50px_rgba(0,0,0,0.3)] rounded-2xl p-10 border border-white/30 dark:border-neutral-700/60 overflow-hidden">
            {/* Inner gradient background for glass effect */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400/15 via-indigo-400/10 to-transparent dark:from-purple-900/25 dark:via-indigo-900/15 dark:to-transparent" />
              <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-purple-400/10 dark:bg-purple-900/15 rounded-full blur-3xl opacity-70" />
              <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-indigo-400/10 dark:bg-indigo-900/15 rounded-full blur-3xl opacity-60" />
            </div>
            
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {formMode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-7 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Sign In</h2>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3.5 bg-red-100/80 dark:bg-red-900/40 border border-red-300/60 dark:border-red-900/60 text-red-800 dark:text-red-300 rounded-lg text-sm shadow-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    {resetMessage.type === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3.5 bg-green-100/80 dark:bg-green-900/40 border border-green-300/60 dark:border-green-900/60 text-green-800 dark:text-green-300 rounded-lg text-sm shadow-sm"
                      >
                        {resetMessage.message}
                      </motion.div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-5">
                        <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="username">
                          Username
                        </label>
                        <div className="relative group">
                          <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                            placeholder="Enter your username"
                          />
                          <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="password">
                          Password
                        </label>
                        <div className="relative group">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                            placeholder="Enter your password"
                          />
                          <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-7">
                        <div className="text-sm">
                          <button 
                            type="button"
                            onClick={() => setFormMode('register')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-all duration-200"
                          >
                            Create an account
                          </button>
                        </div>
                        <div className="text-sm">
                          <button 
                            onClick={() => setFormMode('forgot-password')} 
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-all duration-200"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                          ) : (
                            <MdLogin className="mr-2 h-5 w-5" />
                          )}
                          Sign in
                        </motion.button>
                      </div>
                    </form>
                    
                    <div className="mt-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <motion.button
                          onClick={handleDiscordLogin}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-[#5865F2]/30 dark:border-[#5865F2]/40 rounded-xl shadow-sm bg-white/60 dark:bg-[#5865F2]/10 text-sm font-medium text-[#5865F2] hover:bg-[#5865F2]/5 dark:hover:bg-[#5865F2]/20 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 transition-all duration-200"
                        >
                          <FaDiscord className="h-5 w-5 mr-2" />
                          <span>Sign in with Discord</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {formMode === 'register' && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-7">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Create Account</h2>
                      <motion.button 
                        onClick={() => setFormMode('login')} 
                        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors rounded-full p-1.5 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
                        aria-label="Close"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTimes className="h-5 w-5" />
                      </motion.button>
                    </div>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3.5 bg-red-100/80 dark:bg-red-900/40 border border-red-300/60 dark:border-red-900/60 text-red-800 dark:text-red-300 rounded-lg text-sm shadow-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-5">
                        <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="register-username">
                          Username
                        </label>
                        <div className="relative group">
                          <input
                            id="register-username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                            placeholder="Choose a username"
                          />
                          <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                      
                      <div className="mb-5">
                        <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="register-email">
                          Email
                        </label>
                        <div className="relative group">
                          <input
                            id="register-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                            placeholder="Enter your email"
                          />
                          <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                      
                      <div className="mb-7">
                        <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="register-password">
                          Password
                        </label>
                        <div className="relative group">
                          <input
                            id="register-password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                            placeholder="Create a strong password"
                          />
                          <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                        </div>
                      </div>
                      
                      <div>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                          ) : (
                            <MdLogin className="mr-2 h-5 w-5" />
                          )}
                          Create Account
                        </motion.button>
                      </div>
                    </form>
                    
                    <div className="mt-7 text-center text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Already have an account?{' '}
                      </span>
                      <button 
                        onClick={() => setFormMode('login')} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-all duration-200"
                      >
                        Sign in
                      </button>
                    </div>
                  </motion.div>
                )}

                {formMode === 'forgot-password' && (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-7">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Reset Password</h2>
                      <motion.button 
                        onClick={() => setFormMode('login')} 
                        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors rounded-full p-1.5 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
                        aria-label="Close"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTimes className="h-5 w-5" />
                      </motion.button>
                    </div>
                    
                    {resetMessage.type === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3.5 bg-red-100/80 dark:bg-red-900/40 border border-red-300/60 dark:border-red-900/60 text-red-800 dark:text-red-300 rounded-lg text-sm shadow-sm"
                      >
                        {resetMessage.message}
                      </motion.div>
                    )}
                    
                    <p className="mb-5 text-neutral-600 dark:text-neutral-400 text-sm">
                      Enter the email address associated with your account, and we'll send you instructions to reset your password.
                    </p>
                    
                    <div className="mb-5">
                      <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2" htmlFor="reset-email">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200 shadow-sm"
                          placeholder="Enter your email"
                        />
                        <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 group-focus-within:text-purple-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={awaitingReset}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all duration-200"
                    >
                      {awaitingReset ? (
                        <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                      ) : (
                        <FaEnvelope className="mr-2 h-5 w-5" />
                      )}
                      {awaitingReset ? 'Sending Instructions...' : 'Send Reset Instructions'}
                    </motion.button>
                    
                    <div className="mt-7 text-center text-sm">
                      <button 
                        onClick={() => setFormMode('login')} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-all duration-200"
                      >
                        Back to login
                      </button>
                    </div>
                  </motion.div>
                )}    
              </AnimatePresence>
              
              <AnimatePresence>
                {formMode === 'login' && resetMessage.type === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-red-100/70 dark:bg-red-900/30 border border-red-300/50 dark:border-red-900/50 text-red-800 dark:text-red-300 rounded-lg text-sm"
                  >
                    {resetMessage.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
