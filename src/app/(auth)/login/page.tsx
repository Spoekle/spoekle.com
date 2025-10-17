'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSpinner, FaDiscord, FaTimes, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';
import { cookieUtils } from '@/lib/cookies';

function LoginPageContent() {
  const [formMode, setFormMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [email, setEmail] = useState('');
  const [awaitingReset, setAwaitingReset] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    // Check for error messages from OAuth
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'pending_approval') {
        showError('Your account is pending admin approval. Please check back later.');
      } else if (errorParam === 'discord_auth_failed') {
        showError('Discord authentication failed. Please try again.');
      } else if (errorParam === 'no_code') {
        showError('Authentication cancelled or failed.');
      }
    }
  }, [searchParams, showError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      ? `/api/auth/register`
      : `/api/auth/login`;
      
    try {
      const response = await axios.post(url, formData);
      if (formMode === 'register') {
        setFormMode('login');
        setFormData({ ...formData, password: '' });
        showSuccess('Registration successful! Please login with your credentials.');
      } else {
        cookieUtils.set('token', response.data.token, 7);
        showSuccess('Login successful!');
        // Small delay to allow AuthContext to update
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 100);
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        if (error.response.status === 403) {
          setError('Account awaiting admin approval.');
        } else if (error.response.status === 400) {
          setError(error.response.data.error || 'Invalid username or password.');
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
      showError('Please enter your email address.');
      return;
    }
    
    try {
      setAwaitingReset(true);
      await axios.post(`/api/users/reset-password`, { email });
      showSuccess(`Password reset instructions sent to ${email}. Please check your inbox.`);
      setFormMode('login');
      setEmail('');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        showError('Email not found. Please try again.');
      } else {
        showError('Failed to reset password. Please try again later.');
      }
    } finally {
      setAwaitingReset(false);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = `/api/auth/discord`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/85 dark:bg-neutral-800/85 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_50px_rgba(0,0,0,0.3)] rounded-2xl p-10 border border-white/30 dark:border-neutral-700/60 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400/15 via-indigo-400/10 to-transparent dark:from-purple-900/25 dark:via-indigo-900/15 dark:to-transparent" />
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
                  <h2 className="text-3xl font-bold mb-7 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Sign In</h2>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3.5 bg-red-100/80 dark:bg-red-900/40 border border-red-300/60 dark:border-red-900/60 text-red-800 dark:text-red-300 rounded-lg text-sm"
                    >
                      {error}
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
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200"
                          placeholder="Enter your username"
                        />
                        <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
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
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 dark:border-neutral-600/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 dark:focus:ring-indigo-500/70 focus:border-transparent text-neutral-900 dark:text-white transition-all duration-200"
                          placeholder="Enter your password"
                        />
                        <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-7">
                      <button 
                        type="button"
                        onClick={() => setFormMode('register')}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                      >
                        Create an account
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormMode('forgot-password')} 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
                    >
                      {isSubmitting ? <FaSpinner className="animate-spin mr-2 h-5 w-5" /> : <MdLogin className="mr-2 h-5 w-5" />}
                      Sign in
                    </motion.button>
                  </form>
                  
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleDiscordLogin}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 inline-flex justify-center items-center py-3 px-4 border-2 border-[#5865F2]/30 rounded-xl bg-white/60 dark:bg-[#5865F2]/10 text-sm font-medium text-[#5865F2] hover:bg-[#5865F2]/5"
                    >
                      <FaDiscord className="h-5 w-5 mr-2" />
                      Sign in with Discord
                    </motion.button>
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
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Create Account</h2>
                    <motion.button 
                      onClick={() => setFormMode('login')} 
                      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-full p-1.5"
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
                      className="mb-5 p-3.5 bg-red-100/80 dark:bg-red-900/40 border border-red-300/60 text-red-800 dark:text-red-300 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                      <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2">Username</label>
                      <div className="relative">
                        <input
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 text-neutral-900 dark:text-white"
                          placeholder="Choose a username"
                        />
                        <FaUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                      </div>
                    </div>
                    
                    <div className="mb-5">
                      <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 text-neutral-900 dark:text-white"
                          placeholder="Enter your email"
                        />
                        <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                      </div>
                    </div>
                    
                    <div className="mb-7">
                      <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 text-neutral-900 dark:text-white"
                          placeholder="Create a strong password"
                        />
                        <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                      </div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      {isSubmitting ? <FaSpinner className="animate-spin mr-2 h-5 w-5" /> : <MdLogin className="mr-2 h-5 w-5" />}
                      Create Account
                    </motion.button>
                  </form>
                  
                  <div className="mt-7 text-center text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Already have an account? </span>
                    <button 
                      onClick={() => setFormMode('login')} 
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
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
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">Reset Password</h2>
                    <motion.button 
                      onClick={() => setFormMode('login')} 
                      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 rounded-full p-1.5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaTimes className="h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  <p className="mb-5 text-neutral-600 dark:text-neutral-400 text-sm">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <div className="mb-5">
                    <label className="block text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full px-4 py-2.5 pl-11 bg-white/60 dark:bg-neutral-700/60 border-2 border-neutral-300/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/70 text-neutral-900 dark:text-white"
                        placeholder="Enter your email"
                      />
                      <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    </div>
                  </div>
                  
                  <motion.button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={awaitingReset}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    {awaitingReset ? <FaSpinner className="animate-spin mr-2 h-5 w-5" /> : <FaEnvelope className="mr-2 h-5 w-5" />}
                    {awaitingReset ? 'Sending...' : 'Send Reset Instructions'}
                  </motion.button>
                  
                  <div className="mt-7 text-center text-sm">
                    <button 
                      onClick={() => setFormMode('login')} 
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                      Back to login
                    </button>
                  </div>
                </motion.div>
              )}    
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
