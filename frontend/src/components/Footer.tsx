import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaGithub, FaYoutube, FaSun, FaMoon, FaSnowflake, FaHeart } from 'react-icons/fa';
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
    <footer className="relative bg-transparent min-h-[180px] flex flex-col justify-end overflow-hidden">
      {/* Animated gradient background and blobs for 404-style glass effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-transparent dark:from-purple-900/40 dark:via-indigo-900/20 dark:to-black animate-gradient-move" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold">Spoekle.com</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center md:text-left mb-4">
              Spoekle
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3">Links</h3>
            <ul className="flex flex-col space-y-2 text-center md:text-left">
              <li>
                <Link to="/clips" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                  Browse Clips
                </Link>
              </li>
              <li>
                <Link to="/privacystatement" className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200">
                  Privacy Statement
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/Spoekle/ClipSesh" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Contribute on GitHub
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social and theme toggles */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://discord.gg/dwe8mbC"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-[#5865F2] dark:hover:text-[#5865F2] transition-colors"
                aria-label="Discord"
              >
                <FaDiscord size={24} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.youtube.com/@CubeCommunity"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-[#FF0000] dark:hover:text-[#FF0000] transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Spoekle/ClipSesh"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </motion.a>
            </div>
            
            <div className="flex space-x-3">
              {seasonInfo.season === 'Winter' && (
                <motion.button 
                  whileHover={{ rotate: 45 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSnow} 
                  className={`p-2 rounded-full ${snow ? "text-blue-400" : "text-neutral-400"} hover:bg-neutral-200 dark:hover:bg-neutral-800 transition duration-200`}
                  title='Toggle Snow'
                  aria-label="Toggle Snow Effect"
                >
                  <FaSnowflake size={20} />
                </motion.button>
              )}
              <motion.button 
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode} 
                className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition duration-200"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-xl shadow-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4 md:mb-0">
            © {new Date().getFullYear()} Spoekle. All rights reserved.
          </p>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
            Made with <FaHeart className="mx-1 text-red-500" /> for the Beat Saber community
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;