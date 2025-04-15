import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUserCircle, FaBars } from 'react-icons/fa';
import { MdHome, MdLogin, MdLogout, MdDashboard, MdNotifications } from "react-icons/md";
import LoginModal from '../LoginModal';
import { User } from '../../types/adminTypes';

interface MobileNavbarProps {
  toggleLoginModal: () => void;
  isLoginModalOpen: boolean;
  user: User | null;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  isSearchDropdownOpen: boolean;
  toggleSearchDropdown: () => void;
  handleLogout: () => void;
  fetchUser: () => Promise<User | null>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  searchInput: string;
  handleSearch: (e: React.FormEvent) => void;
  recentSearches: string[];
  removeRecentSearch: (search: string) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  toggleLoginModal,
  isLoginModalOpen,
  user,
  handleLogout,
  fetchUser,
  setSearchInput,
  searchInput,
  handleSearch,
  recentSearches,
  removeRecentSearch
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setShowSearch(false);
  };

  const toggleSearch = (): void => {
    setShowSearch(!showSearch);
  };

  const handleSubmitSearch = (e: React.FormEvent): void => {
    handleSearch(e);
    setShowSearch(false);
    setMenuOpen(false);
  };
  
  // Animation variants
  const iconButtonVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };
  
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.07
      }
    }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const searchDropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <div className="relative">
      {/* Top right icons */}
      <div className="flex items-center gap-2">
        <motion.button 
          variants={iconButtonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleSearch}
          className="p-2 rounded-full bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-700/50 border border-white/10 dark:border-neutral-700/30 shadow-sm"
          aria-label="Search"
        >
          <FaSearch size={18} />
        </motion.button>
        
        <motion.button
          variants={iconButtonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-700/50 border border-white/10 dark:border-neutral-700/30 shadow-sm"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </motion.button>
      </div>

      {/* Mobile search dropdown */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            variants={searchDropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-12 right-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-lg rounded-lg p-3 w-screen max-w-md z-30 border border-white/20 dark:border-neutral-700/50 overflow-hidden"
          >
            {/* Gradient background for glass effect */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-400/5 via-indigo-400/5 to-transparent dark:from-purple-900/10 dark:via-indigo-900/5 dark:to-transparent" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-3xl opacity-60" />
            </div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmitSearch}>
                <div className="flex">
                  <motion.input
                    initial={{ width: "90%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    className="flex-grow px-3 py-2 bg-white/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500 border border-white/20 dark:border-neutral-700/50"
                    placeholder="Search clips..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoFocus
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 rounded-r-lg flex items-center shadow-md"
                  >
                    <FaSearch />
                  </motion.button>
                </div>
              </form>

              {recentSearches.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-3 border-t border-white/10 dark:border-neutral-700/50 pt-2"
                >
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Recent Searches</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        localStorage.setItem('recentSearches', '[]');
                        removeRecentSearch('all');
                      }}
                      className="text-xs text-purple-500 hover:text-purple-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Clear All
                    </motion.button>
                  </div>
                  
                  <ul className="mt-1 max-h-64 overflow-y-auto">
                    {recentSearches.map((search, index) => (
                      <motion.li 
                        key={search}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="py-2 hover:bg-white/30 dark:hover:bg-neutral-700/30 px-2 rounded-lg"
                      >
                        <button 
                          className="w-full text-left text-sm flex gap-2 items-center"
                          onClick={() => {
                            setSearchInput(search);
                            handleSearch({ preventDefault: () => {}} as React.FormEvent);
                            setShowSearch(false);
                          }}
                        >
                          <FaSearch size={12} className="text-neutral-400" />
                          {search}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu-portal"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999999,
              overflowY: 'auto'
            }}
            className="fixed top-0 left-0 right-0 bottom-0 width-[100vw] height[100vh] z-20"
          >
            {/* Animated gradient background and blobs for glass effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-transparent dark:from-purple-900/40 dark:via-indigo-900/20 dark:to-black animate-gradient-move" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-900/30 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full blur-2xl opacity-50 animate-pulse-slow" />
            </div>
            
            {/* Backdrop */}
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md"></div>
            
            {/* Close button */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{ 
                position: 'absolute',
                top: '1rem',
                right: '1rem'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(false)}
                className="p-3 rounded-full bg-white/40 dark:bg-neutral-800/40 hover:bg-white/60 dark:hover:bg-neutral-700/60 border border-white/10 dark:border-neutral-700/30 shadow-md"
              >
                <FaTimes size={24} className="text-neutral-700 dark:text-white" />
              </motion.button>
            </motion.div>
            
            {/* Content container */}
            <motion.div 
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ 
                padding: '5rem 1.5rem 6rem',
                maxWidth: '48rem',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
              }}
            >
              {/* Navigation Links */}
              <motion.h2 
                variants={menuItemVariants}
                className="text-xl font-bold text-neutral-900 dark:text-white mb-6"
              >
                Navigation
              </motion.h2>
              
              <motion.nav variants={menuItemVariants} className="mb-8">
                <ul className="space-y-1">
                  <motion.li variants={menuItemVariants}>
                    <NavLink
                      to="/"
                      className={({isActive}) => `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                          : 'text-neutral-800 dark:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <MdHome size={22} className="mr-3" />
                      <span className="font-medium">Home</span>
                    </NavLink>
                  </motion.li>
                  <motion.li variants={menuItemVariants}>
                    <NavLink
                      to="/clips"
                      className={({isActive}) => `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                          : 'text-neutral-800 dark:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaSearch size={22} className="mr-3" />
                      <span className="font-medium">Browse Clips</span>
                    </NavLink>
                  </motion.li>
                  
                  {/* Team Links */}
                  {user && (user.roles?.includes('admin') || user.roles?.includes('editor')) && (
                    <motion.li variants={menuItemVariants}>
                      <NavLink
                        to="/editor"
                        className={({isActive}) => `flex items-center p-3 rounded-lg ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                            : 'text-neutral-800 dark:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <FaUserCircle size={22} className="mr-3" />
                        <span className="font-medium">Editor Dashboard</span>
                      </NavLink>
                    </motion.li>
                  )}
                  
                  {user && user.roles?.includes('admin') && (
                    <motion.li variants={menuItemVariants}>
                      <NavLink
                        to="/admin"
                        className={({isActive}) => `flex items-center p-3 rounded-lg ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                            : 'text-neutral-800 dark:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <MdDashboard size={22} className="mr-3" />
                        <span className="font-medium">Admin Dashboard</span>
                      </NavLink>
                    </motion.li>
                  )}
                  <motion.li variants={menuItemVariants}>
                    <NavLink
                      to="/notifications"
                      className={({isActive}) => `flex items-center p-3 rounded-lg ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                          : 'text-neutral-800 dark:text-white hover:bg-white/40 dark:hover:bg-neutral-800/40'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <MdNotifications size={22} className="mr-3" />
                      <span>All Notifications</span>
                    </NavLink>
                  </motion.li>
                </ul>
              </motion.nav>
              
              {/* User Account */}
              {user ? (
                <motion.div variants={menuItemVariants}>
                  <motion.h2 
                    variants={menuItemVariants}
                    className="text-xl font-bold text-neutral-900 dark:text-white mb-4"
                  >
                    Account
                  </motion.h2>
                  <motion.div 
                    variants={menuItemVariants}
                    className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10 dark:border-neutral-700/30 shadow-md overflow-hidden"
                  >
                    {/* Gradient background for glass effect */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400/5 via-indigo-400/5 to-transparent dark:from-purple-900/10 dark:via-indigo-900/5 dark:to-transparent" />
                    </div>
                    
                    <div className="relative z-10">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 mb-4"
                      >
                        <motion.img 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                          alt={user.username} 
                          className="w-12 h-12 rounded-full object-cover border border-white/20 dark:border-neutral-700/50 shadow-md" 
                        />
                        <div>
                          <h3 className="font-bold text-neutral-900 dark:text-white">{user.username}</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {user.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.button
                        variants={menuItemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg flex items-center justify-center gap-2 shadow-md"
                      >
                        <MdLogout size={20} />
                        <span>Sign out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  variants={menuItemVariants}
                  className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-xl p-6 mb-6 flex flex-col items-center border border-white/10 dark:border-neutral-700/30 shadow-md overflow-hidden"
                >
                  {/* Gradient background for glass effect */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400/5 via-indigo-400/5 to-transparent dark:from-purple-900/10 dark:via-indigo-900/5 dark:to-transparent" />
                  </div>
                  
                  <div className="relative z-10 w-full text-center">
                    <h3 className="text-center text-lg font-medium text-neutral-900 dark:text-white mb-4">Sign in to your account</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      onClick={() => {
                        setMenuOpen(false);
                        toggleLoginModal();
                      }}
                      className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg flex items-center gap-2 justify-center shadow-md w-full"
                    >
                      <MdLogin size={20} />
                      <span>Sign In</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {/* Search box */}
              <motion.div 
                variants={menuItemVariants}
                className="mt-8 mb-20"
              >
                <motion.h2 
                  variants={menuItemVariants}
                  className="text-xl font-bold text-neutral-900 dark:text-white mb-4"
                >
                  Search
                </motion.h2>
                <form onSubmit={handleSubmitSearch}>
                  <motion.div 
                    variants={menuItemVariants}
                    className="flex"
                  >
                    <input
                      type="text"
                      className="flex-grow px-4 py-3 bg-white/70 dark:bg-neutral-700/70 text-neutral-900 dark:text-white rounded-l-lg border border-white/20 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-indigo-500"
                      placeholder="Search clips..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 rounded-r-lg flex items-center shadow-md"
                    >
                      <FaSearch size={18} />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoginModalOpen && (
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          setIsLoginModalOpen={toggleLoginModal}
          fetchUser={fetchUser}
        />
      )}
    </div>
  );
}

export default MobileNavbar;