'use client';

import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

export default function ScrollIndicator() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      onClick={handleScroll}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <FaChevronDown className="text-2xl" />
      </motion.div>
    </motion.button>
  );
}
