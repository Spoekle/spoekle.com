'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-neutral-900 dark:text-white leading-tight mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-xl shadow-lg transition-all"
            >
              <FaHome />
              Go Back Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
