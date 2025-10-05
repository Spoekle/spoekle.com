import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import useWindowWidth from '../hooks/useWindowWidth';
import { User } from '../types/adminTypes';

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // Check scroll position to add background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Navbar animation variants
  const navbarVariants = {
    initial: {
      y: -20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const logoVariants = {
    initial: { opacity: 0, rotate: -10 },
    animate: { 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15
      }
    },
    hover: { 
      rotate: 10, 
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        repeatDelay: 0.5
      } 
    }
  };

  // Using framer-motion's animate prop for smooth transitions
  const navbarStyle = {
    width: isScrolled ? '100%' : '94%',
    maxWidth: isScrolled ? '100%' : '1600px',
    borderRadius: isScrolled ? '0px' : '12px',
    marginTop: isScrolled ? '0px' : '16px',
    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center overflow-visible">
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navbarVariants}
        style={navbarStyle}
        className={`p-2 w-full ${
          isScrolled 
            ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-xl border-b border-white/10 dark:border-neutral-800/30' 
            : 'bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm border border-white/10 dark:border-neutral-700/30 shadow-lg'
        } text-neutral-800 dark:text-white overflow-visible`}
      >
        {/* Animated gradient background for glass effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-purple-400/10 via-indigo-400/5 to-transparent dark:from-purple-900/20 dark:via-indigo-900/10 dark:to-transparent" />
          <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[150px] h-[150px] bg-indigo-400/5 dark:bg-indigo-900/10 rounded-full blur-2xl opacity-50" />
        </div>
        
        <div className="container mx-auto flex items-center justify-between relative z-10">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <NavLink 
              to="/" 
              className="flex items-center mr-6 bg-transparent hover:text-transparent transition-all duration-300 group"
            >
              <motion.img 
                variants={logoVariants}
                whileHover="hover"
                transition={{ duration: 0.5 }}
                src={'/image/spoekle-icon.webp'} 
                alt="Logo" 
                className="h-10 mr-2" 
              />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-bold text-xl tracking-tight text-neutral-800 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent"
              >
                Spoekle.com
              </motion.span>
            </NavLink>
          </motion.div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white/20 dark:hover:bg-neutral-800/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
          
          {/* Desktop Navigation */}
          <div className={`flex-grow ${isMobile ? 'hidden' : 'flex'} items-center justify-start space-x-4`}>
            <NavLink to="/about" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              About
            </NavLink>
            <NavLink to="/blog" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              Blog
            </NavLink>
            <NavLink to="/games" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              Games
            </NavLink>
            <NavLink to="/photography" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              Photography
            </NavLink>
            <NavLink to="/portfolio" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              Portfolio
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => `px-3 py-2 rounded-lg font-medium transition-colors ${isActive ? 'bg-white/20 dark:bg-neutral-800/30 text-purple-600 dark:text-purple-400' : 'hover:bg-white/10 dark:hover:bg-neutral-800/20'}`}>
              Contact
            </NavLink>
          </div>
          
          {/* Right Side - Search & Auth */}
          <div className={`${isMobile ? 'hidden' : 'flex'} items-center space-x-4`}>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg text-neutral-500 bg-white/70 dark:bg-neutral-800/70 border border-white/20 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500 w-40 md:w-auto"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </form>
            
            {/* User Menu / Login Button */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer">
                  <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                    alt={user.username} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block">{user.username}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 dark:border-neutral-700/50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="py-1">
                    <NavLink to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-white/30 dark:hover:bg-neutral-700/30">
                      <FaUserCircle className="mr-2" />
                      Profile
                    </NavLink>
                    {user.roles && Array.isArray(user.roles) && user.roles.includes('admin') && (
                      <NavLink to="/admin" className="flex items-center px-4 py-2 text-sm hover:bg-white/30 dark:hover:bg-neutral-700/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-white/30 dark:hover:bg-neutral-700/30"
                    >
                      <MdLogout className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink 
                to="/login" 
                className="flex items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <FaUserCircle className="mr-2" />
                <span>Sign In</span>
              </NavLink>
            )}
          </div>
          
          {/* Mobile Menu */}
          {isMobile && isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 dark:border-neutral-700/50 p-4">
              <div className="space-y-3">
                <NavLink 
                  to="/about" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/blog" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </NavLink>
                <NavLink 
                  to="/games" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Games
                </NavLink>
                <NavLink 
                  to="/photography" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Photography
                </NavLink>
                <NavLink 
                  to="/portfolio" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portfolio
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative mt-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-neutral-500 bg-white/70 dark:bg-neutral-800/70 border border-white/20 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                </form>
                
                {/* Auth */}
                <div className="pt-3 mt-3 border-t border-white/20 dark:border-neutral-700/50">
                  {user ? (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                          alt={user.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {user.roles && Array.isArray(user.roles) ? user.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ') : ''}
                          </div>
                        </div>
                      </div>
                      
                      <NavLink 
                        to="/profile" 
                        className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaUserCircle className="mr-2" />
                        Profile
                      </NavLink>
                      
                      {user.roles && Array.isArray(user.roles) && user.roles.includes('admin') && (
                        <NavLink 
                          to="/admin" 
                          className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-700/30 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Dashboard
                        </NavLink>
                      )}
                      
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full mt-3 text-left flex items-center py-2 px-3 rounded-lg bg-red-500/10 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <MdLogout className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <NavLink 
                      to="/login" 
                      className="flex items-center justify-center w-full py-2 text-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-colors shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserCircle className="mr-2" />
                      Sign In
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;