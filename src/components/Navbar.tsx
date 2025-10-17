'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import useWindowWidth from '@/hooks/useWindowWidth';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
      router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const handleLogout = (): void => {
    logout();
    router.push('/');
  };

  const navbarStyle = {
    width: isScrolled ? '100%' : '96%',
    maxWidth: isScrolled ? '100%' : '1600px',
    borderRadius: isScrolled ? '0px' : '24px',
    marginTop: isScrolled ? '0px' : '20px',
    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center overflow-visible">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={navbarStyle}
        className={`p-3 w-full ${
          isScrolled 
            ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-lg border-b border-neutral-200 dark:border-neutral-800' 
            : 'bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-md'
        } text-neutral-900 dark:text-white overflow-visible`}
      >
        
        <div className="container mx-auto flex items-center justify-between relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <Link 
              href="/" 
              className="flex items-center mr-8 bg-transparent hover:text-transparent transition-all duration-300 group"
            >
              <Image 
                src="/assets/spoekle-icon.webp" 
                alt="Logo" 
                width={44}
                height={44}
                className="h-11 w-11 mr-3 rounded-xl" 
              />
              <span className="font-bold text-2xl tracking-tight text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors duration-300">
                SPOEKLE
              </span>
            </Link>
          </motion.div>
          
          {mounted && isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
          
          <div className={`flex-grow ${!mounted || isMobile ? 'hidden' : 'flex'} items-center justify-start space-x-2`}>
            <Link href="/about" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/about') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              About
            </Link>
            <Link href="/blog" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/blog') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              Blog
            </Link>
            <Link href="/games" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/games') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              Games
            </Link>
            <Link href="/photography" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/photography') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              Photography
            </Link>
            <Link href="/portfolio" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/portfolio') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              Portfolio
            </Link>
            <Link href="/contact" className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive('/contact') ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              Contact
            </Link>
          </div>
          
          <div className={`${!mounted || isMobile ? 'hidden' : 'flex'} items-center space-x-4`}>
            
            {user && user.username ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer">
                  {user.profilePicture ? (
                    <Image 
                      src={user.profilePicture} 
                      alt={user.username}
                      unoptimized
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                      onError={(e) => {
                        // Fallback to UI Avatars if image fails to load
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-semibold text-sm">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden md:block font-medium">{user.username}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="py-1">
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <FaUserCircle className="mr-2" />
                      Profile
                    </Link>
                    {user.roles?.includes('admin') && (
                      <Link href="/admin" className="flex items-center px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <MdLogout className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2 rounded-lg transition-colors duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-medium"
              >
                <FaUserCircle className="mr-2" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
          
          {mounted && isMobile && isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 mx-3 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-3">
              {/* Mobile menu content - similar to original but with Next.js Link */}
              <div className="space-y-1">
                <Link href="/about" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link href="/blog" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link href="/games" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Games</Link>
                <Link href="/photography" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Photography</Link>
                <Link href="/portfolio" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
                <Link href="/contact" className="block py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                {user && user.username ? (
                  <>
                    <div className="border-t border-neutral-200 dark:border-neutral-700 my-2" />
                    <Link href="/profile" className="flex items-center py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                      <FaUserCircle className="mr-2" />
                      Profile
                    </Link>
                    {user.roles?.includes('admin') && (
                      <Link href="/admin" className="flex items-center py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left flex items-center py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium text-red-600 dark:text-red-400"
                    >
                      <MdLogout className="mr-2" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-neutral-200 dark:border-neutral-700 my-2" />
                    <Link 
                      href="/login" 
                      className="flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2 px-3 rounded-lg transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-100 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserCircle className="mr-2" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
