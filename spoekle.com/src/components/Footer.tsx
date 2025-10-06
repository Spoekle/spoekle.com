'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaYoutube, FaSun, FaMoon, FaSnowflake, FaTiktok, FaLinkedin, FaTwitch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme !== 'light';
    }
    return true;
  });
  
  const [seasonInfo, setSeasonInfo] = useState({ season: '' });
  
  const [snow, setSnow] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSnow = localStorage.getItem('snow');
      return savedSnow !== 'false';
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    getSeason();
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('snow', snow ? 'true' : 'false');
    }
  }, [snow]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSnow = () => {
    setSnow(!snow);
  }; 

  const getSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    let season = '';
  
    if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20)) {
      season = 'Spring';
    } else if ((month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 20)) {
      season = 'Summer';
    } else if ((month === 9 && day >= 21) || (month > 9 && month < 12) || (month === 12 && day <= 20)) {
      season = 'Fall';
    } else {
      season = 'Winter';
    }
  
    setSeasonInfo({ season });
  };

  return (
    <footer className="relative bg-white dark:bg-neutral-900 transition duration-200 pb-4 pt-12 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2 mb-3 group">
              <Image src="/image/spoekle-icon.webp" alt="Spoekle Logo" width={32} height={32} className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-neutral-800 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition duration-300">
                Spoekle.com
              </span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center md:text-left mb-4">
              Developer, Content Creator, and Gamer
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} Spoekle. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-white">Links</h3>
            <ul className="flex flex-col space-y-2 text-center md:text-left">
              <li><Link href="/" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition duration-200">Home</Link></li>
              <li><Link href="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition duration-200">Contact</Link></li>
              <li><Link href="/privacy-statement" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition duration-200">Privacy Statement</Link></li>
              <li><a href="https://github.com/Spoekle" target="_blank" rel="noreferrer" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition duration-200">GitHub</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-white">Connect With Me</h3>
            <div className="flex space-x-4 mb-4">
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} href="https://www.youtube.com/@Spoekle" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="YouTube">
                <FaYoutube size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} href="https://twitch.tv/Spoekle" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Twitch">
                <FaTwitch size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} href="https://tiktok.com/@Spoekle" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="TikTok">
                <FaTiktok size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} href="https://linkedin.com/in/thiangraber" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }} href="https://github.com/Spoekle" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub size={20} />
              </motion.a>
            </div>
            
            <div className="flex space-x-3">
              {seasonInfo.season === 'Winter' && (
                <motion.button whileHover={{ rotate: 45 }} whileTap={{ scale: 0.9 }} onClick={toggleSnow} className={`p-2 rounded-lg ${snow ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"} bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition duration-200`} title='Toggle Snow' aria-label="Toggle Snow Effect">
                  <FaSnowflake size={18} />
                </motion.button>
              )}
              <motion.button whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }} onClick={toggleDarkMode} className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition duration-200" title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
