import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaTimes, FaDiscord, FaSpinner } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import axios from 'axios';

const LoginModal = ({ setIsLoginModalOpen, isLoginModalOpen, fetchUser }) => {
  const [formMode, setFormMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState({ type: '', message: '' });
  const [awaitingReset, setAwaitingReset] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setResetMessage({ type: '', message: '' });
  };

  const handleClose = () => {
    const modalContent = document.querySelector('.modal-content');
    const modalOverlay = document.querySelector('.login-modal-overlay');
    
    if (modalContent && modalOverlay) {
      modalContent.style.transition = 'transform 300ms, opacity 300ms';
      modalContent.style.transform = 'scale(0.9)';
      modalContent.style.opacity = '0';
      modalOverlay.style.transition = 'opacity 300ms';
      modalOverlay.style.opacity = '0';
      setTimeout(() => setIsLoginModalOpen(false), 300);
    } else {
      setIsLoginModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
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
        localStorage.setItem('username', response.data.username);
        await fetchUser();
        handleClose();
      }
    } catch (error) {
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
    } catch (error) {
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

  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 500 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent login-modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated gradient background and blobs for glass effect */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-transparent dark:from-purple-900/40 dark:via-indigo-900/20 dark:to-black animate-gradient-move" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
          </div>
          
          {/* Modal backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <motion.div
            className="relative z-10 w-full max-w-md mx-auto rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl p-8 modal-content border border-white/20 dark:border-neutral-700/50 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Inner gradient background for glass effect */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400/10 via-indigo-400/5 to-transparent dark:from-purple-900/20 dark:via-indigo-900/10 dark:to-transparent" />
              <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-0 right-1/4 w-[150px] h-[150px] bg-indigo-400/5 dark:bg-indigo-900/10 rounded-full blur-2xl opacity-50" />
            </div>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-white/30 dark:hover:bg-neutral-700/50 z-10"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>

            <div className="p-8 relative z-10">
              {formMode === 'login' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Sign In</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100/70 dark:bg-red-900/30 border border-red-300/50 dark:border-red-900/50 text-red-800 dark:text-red-300 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {resetMessage.type === 'success' && (
                    <div className="mb-4 p-3 bg-green-100/70 dark:bg-green-900/30 border border-green-300/50 dark:border-green-900/50 text-green-800 dark:text-green-300 rounded-lg text-sm">
                      {resetMessage.message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="login-username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-neutral-500" />
                        </div>
                        <input
                          id="login-username"
                          type="text"
                          name="username"
                          placeholder="Enter your username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-neutral-700/70 border border-white/30 dark:border-neutral-600/50 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="login-password"
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-neutral-700/70 border border-white/30 dark:border-neutral-600/50 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2.5 rounded-lg transition duration-200 flex items-center justify-center font-medium shadow-md"
                    >
                      {isSubmitting ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <>
                          <MdLogin className="mr-2" />
                          Sign In
                        </>
                      )}
                    </motion.button>
                    
                    <div className="relative py-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200/50 dark:border-neutral-700/50"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white/50 dark:bg-neutral-900/50 px-2 text-sm text-neutral-500 backdrop-blur-sm">Or continue with</span>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={handleDiscordLogin}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white py-2.5 rounded-lg transition duration-200 shadow-md"
                    >
                      <FaDiscord size={20} />
                      Sign in with Discord
                    </motion.button>
                  </form>
                  
                  <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 text-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFormMode('register');
                        setError('');
                      }}
                      className="text-purple-600 dark:text-indigo-400 hover:underline text-sm"
                    >
                      Don't have an account? Register
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFormMode('reset');
                        setError('');
                      }}
                      className="text-purple-600 dark:text-indigo-400 hover:underline text-sm"
                    >
                      Forgot your password?
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {formMode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Create Account</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100/70 dark:bg-red-900/30 border border-red-300/50 dark:border-red-900/50 text-red-800 dark:text-red-300 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="register-username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-neutral-500" />
                        </div>
                        <input
                          id="register-username"
                          type="text"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          maxLength={30}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-neutral-700/70 border border-white/30 dark:border-neutral-600/50 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="register-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          id="register-password"
                          type="password"
                          name="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-neutral-700/70 border border-white/30 dark:border-neutral-600/50 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2.5 rounded-lg transition duration-200 flex items-center justify-center font-medium shadow-md"
                    >
                      {isSubmitting ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        'Create Account'
                      )}
                    </motion.button>
                    
                    <div className="relative py-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200/50 dark:border-neutral-700/50"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white/50 dark:bg-neutral-900/50 px-2 text-sm text-neutral-500 backdrop-blur-sm">Or continue with</span>
                      </div>
                    </div>
                    
                    <motion.button
                      type="button"
                      onClick={handleDiscordLogin}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white py-2.5 rounded-lg transition duration-200 shadow-md"
                    >
                      <FaDiscord size={20} />
                      Register with Discord
                    </motion.button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFormMode('login');
                        setError('');
                      }}
                      className="text-purple-600 dark:text-indigo-400 hover:underline text-sm"
                    >
                      Already have an account? Sign in
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {formMode === 'reset' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Reset Password</h2>
                  <p className="mb-6 text-neutral-600 dark:text-neutral-400 text-sm">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  {resetMessage.type && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                      resetMessage.type === 'success' 
                        ? 'bg-green-100/70 dark:bg-green-900/30 border border-green-300/50 dark:border-green-900/50 text-green-800 dark:text-green-300' 
                        : 'bg-red-100/70 dark:bg-red-900/30 border border-red-300/50 dark:border-red-900/50 text-red-800 dark:text-red-300'
                    }`}>
                      {resetMessage.message}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="reset-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={handleEmailChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-neutral-700/70 border border-white/30 dark:border-neutral-600/50 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handlePasswordReset}
                      disabled={awaitingReset || !email.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 dark:disabled:from-purple-800 dark:disabled:to-indigo-800 disabled:cursor-not-allowed text-white py-2.5 rounded-lg transition duration-200 flex items-center justify-center font-medium shadow-md"
                    >
                      {awaitingReset ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        'Reset Password'
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setFormMode('login');
                        setResetMessage({ type: '', message: '' });
                      }}
                      className="text-purple-600 dark:text-indigo-400 hover:underline text-sm"
                    >
                      Back to Sign In
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
