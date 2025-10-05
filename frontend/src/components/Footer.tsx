import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaYoutube, FaSun, FaMoon, FaSnowflake, FaTiktok, FaLinkedin, FaTwitch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== 'light';
  });
  
  const [seasonInfo, setSeasonInfo] = useState({ season: '' });
  
  const [snow, setSnow] = useState(() => {
    const savedSnow = localStorage.getItem('snow');
    return savedSnow !== 'false';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    getSeason();

    if (snow) {
      localStorage.setItem('snow', 'true');
    } else {
      localStorage.setItem('snow', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSnow = () => {
    setSnow(!snow);
    localStorage.setItem('snow', snow ? 'true' : 'false');
  }; 

  const getSeason = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    let season = '';
  
    if (
      (month === 3 && day >= 20) ||
      (month > 3 && month < 6) ||
      (month === 6 && day <= 20)
    ) {
      season = 'Spring';
    } else if (
      (month === 6 && day >= 21) ||
      (month > 6 && month < 9) ||
      (month === 9 && day <= 20)
    ) {
      season = 'Summer';
    } else if (
      (month === 9 && day >= 21) ||
      (month > 9 && month < 12) ||
      (month === 12 && day <= 20)
    ) {
      season = 'Fall';
    } else {
      season = 'Winter';
    }
  
    setSeasonInfo(prevSeasonInfo => ({
      ...prevSeasonInfo,
      season
    }));
  };

  return (
    <footer className="relative bg-neutral-200 dark:bg-neutral-900 transition duration-200 pb-4 pt-12 overflow-hidden">
      {/* Animated gradient background and blobs for glass effect to match the site style */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-purple-400/10 via-indigo-400/5 to-transparent dark:from-purple-900/20 dark:via-indigo-900/10 dark:to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/5 dark:bg-indigo-900/10 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
      </div>
      <div className="z-10 container mx-auto px-">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 backdrop-blur-sm bg-white/5 dark:bg-black/5 rounded-2xl border border-white/10 dark:border-neutral-700/30 shadow-xl mb-6">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-3 group">
              <img src="/image/spoekle-icon.webp" alt="Spoekle Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold text-neutral-800 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition duration-300">Spoekle.com</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center md:text-left mb-4">
              Developer, Content Creator, and Gamer
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 justify-end">
              © {new Date().getFullYear()} Spoekle. All rights reserved.
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-white">Links</h3>
            <ul className="flex flex-col space-y-2 text-center md:text-left">
              <li>
                <Link to="/" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacystatement" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200">
                  Privacy Statement
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/Spoekle"
                  target="_blank" 
                  rel="noreferrer"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social and theme toggles */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-white">Connect With Me</h3>
            <div className="flex space-x-4 mb-4">
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.youtube.com/@Spoekle"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors shadow-md"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitch.tv/Spoekle"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-purple-600 transition-colors shadow-md"
                aria-label="Twitch"
              >
                <FaTwitch size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://tiktok.com/@Spoekle"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shadow-md"
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com/in/thiangraber"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors shadow-md"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Spoekle"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shadow-md"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </motion.a>
            </div>
            
            <div className="flex space-x-3">
              {seasonInfo.season === 'Winter' && (
                <motion.button 
                  whileHover={{ rotate: 45 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSnow} 
                  className={`p-2 rounded-full ${snow ? "text-blue-400" : "text-neutral-400"} bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition duration-200 shadow-md`}
                  title='Toggle Snow'
                  aria-label="Toggle Snow Effect"
                >
                  <FaSnowflake size={18} />
                </motion.button>
              )}
              <motion.button 
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode} 
                className="p-2 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition duration-200 shadow-md"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
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