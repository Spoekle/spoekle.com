'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const token = params.token as string;
  
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      setIsValidating(true);
      // We'll validate by attempting to use the token
      // If it's invalid, the actual reset will fail
      setIsValidToken(true);
    } catch (error) {
      setIsValidToken(false);
      showError('Invalid or expired reset link');
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`/api/users/reset-password/${token}`, {
        token,
        newPassword: passwords.newPassword
      });

      showSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.response?.status === 400) {
        showError(error.response.data.error || 'Invalid or expired reset link');
      } else {
        showError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/85 dark:bg-neutral-800/85 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-white/30 dark:border-neutral-700/60">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pl-11 bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 pl-11 bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <FaLock />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
