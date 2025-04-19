// filepath: /data/compose/spoekle.com/frontend/src/layouts/AuthenticationLayout.tsx
import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaShieldAlt, FaUserCheck } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

interface AuthenticationLayoutProps {
  children: ReactNode;
  isAdminRequired?: boolean;
  isEditorRequired?: boolean;
  isVerifiedRequired?: boolean;
}

const AuthenticationLayout = ({ 
  children, 
  isAdminRequired = false, 
  isEditorRequired = false, 
  isVerifiedRequired = false 
}: AuthenticationLayoutProps) => {
  const [authCheckComplete, setAuthCheckComplete] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Checking authentication...');

  useEffect(() => {
    // Set up different messages for different auth checks
    if (isAdminRequired) {
      setLoadingMessage('Verifying Admin privileges...');
    } else if (isEditorRequired) {
      setLoadingMessage('Verifying Editor privileges...');
    } else if (isVerifiedRequired) {
      setLoadingMessage('Verifying User privileges...');
    }
    
    // Hide loading screen after a short delay to allow animations to play
    const timer = setTimeout(() => {
      setAuthCheckComplete(true);
      setTimeout(() => {
        setShowLoadingScreen(false);
      }, 300);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAdminRequired, isEditorRequired, isVerifiedRequired]);

  if (!showLoadingScreen) {
    return <>{children}</>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-neutral-200 dark:bg-neutral-900 transition-all duration-300 flex flex-col"
    >
      <Helmet>
        <title>Authentication | Spoekle.com</title>
        <meta name="description" content="Verifying authentication and permissions" />
      </Helmet>
      
      <div 
        className="w-full h-96 bg-cover bg-center relative"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' 
        }}
      >
        {/* Loading UI content */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 to-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white px-4 max-w-xl mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="mb-6 relative"
            >
              {isAdminRequired ? (
                <FaShieldAlt className="text-6xl text-red-500" />
              ) : isVerifiedRequired ? (
                <FaUserCheck className="text-6xl text-blue-500" />
              ) : (
                <FaLock className="text-6xl text-amber-500" />
              )}
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1] 
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-2 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Secure Access Required
            </motion.h1>
            
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="h-px bg-white/30 flex-1"></span>
              <span className="text-white/70 text-sm uppercase tracking-wider">Spoekle.com</span>
              <span className="h-px bg-white/30 flex-1"></span>
            </motion.div>
            
            <motion.p 
              className="text-xl text-center text-white/90 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {loadingMessage}
            </motion.p>
            
            <motion.div 
              className="mt-8 flex justify-center items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: authCheckComplete ? [1, 0] : 1,
                transition: { 
                  opacity: { duration: 0.3 },
                  delay: 0.5
                }
              }}
            >
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div 
          className="relative w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: authCheckComplete ? '100%' : '90%' }}
              transition={{ 
                duration: authCheckComplete ? 0.2 : 0.8,
                ease: "easeOut" 
              }}
            />
          </div>
          <p className="text-center mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {authCheckComplete ? 'Authentication complete!' : 'Validating credentials...'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthenticationLayout;
