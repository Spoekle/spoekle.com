import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaDiscord, FaYoutube, FaTwitch } from 'react-icons/fa';
import Carousel from './components/Carousel';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Update scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock video data (you can fetch this from an API later)
  const videos = [
    { id: 1, title: 'Beat Saber Gameplay', thumbnail: '/image/beat-saber-5.jpg', url: 'https://www.youtube.com/watch?v=example1' },
    { id: 2, title: 'Minecraft Adventure', thumbnail: '/image/minecraft.webp', url: 'https://www.youtube.com/watch?v=example2' },
    { id: 3, title: 'Coding Session', thumbnail: '/image/spoeklecom.png', url: 'https://www.youtube.com/watch?v=example3' },
    { id: 4, title: 'Random Fun', thumbnail: '/image/me.webp', url: 'https://www.youtube.com/watch?v=example4' },
  ];

  // Mock images for the carousel (replace with API data later)
  const carouselImages = [
    { id: 1, url: '/image/spoekle.webp', alt: 'Spoekle Portrait' },
    { id: 2, url: '/image/me.webp', alt: 'Spoekle Fun' },
    { id: 3, url: '/image/beat-saber-5.jpg', alt: 'Beat Saber' },
    { id: 4, url: '/image/minecraft.webp', alt: 'Minecraft' },
  ];

  return (
    <div className="min-h-screen dark:bg-neutral-900 overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Section */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl pointer-events-none select-none">
          <Carousel images={carouselImages} />
        </div>
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black/50 z-10"
          style={{ 
            backgroundPosition: `center ${scrollY * 0.5}px`
          }}
        />
        
        {/* Glass texture overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5 z-20" />
        
        {/* Hero content */}
        <motion.div 
          className="relative z-30 text-center px-4"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6 uppercase"
            variants={fadeIn}
          >
            Spoekle's Hub
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            Welcome to all things Spoekle.
          </motion.p>
          <motion.div 
            className="mt-8"
            variants={fadeIn}
          >
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/50 transition duration-300 transform hover:scale-105">
              Explore Now
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Me Section with Glass Card */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div 
              className="md:w-1/2"
              variants={fadeIn}
            >
              <img 
                src="/image/spoekle.webp" 
                alt="Spoekle" 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform -rotate-3 hover:rotate-0 transition duration-500"
              />
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              variants={fadeIn}
            >
              <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/10 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
                <p className="text-gray-300 mb-4">
                  Hey there! I'm Spoekle, a passionate developer, content creator, and gamer.
                </p>
                <p className="text-gray-300 mb-4">
                  When I'm not coding, you'll find me playing Beat Saber, exploring in Minecraft,
                  or creating content for my YouTube channel.
                </p>
                <p className="text-gray-300">
                  This site serves as a hub for all my projects, gaming adventures, and random creative endeavors.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-6"
              variants={fadeIn}
            >
              Latest Videos
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Check out some of my recent content
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {videos.map((video) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-all duration-300">
                          <FaYoutube size={30} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition duration-300">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Discord Link Section */}
      <section className="py-16 bg-indigo-950/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col items-center text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mb-6"
              variants={fadeIn}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <FaDiscord size={40} className="text-white" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              variants={fadeIn}
            >
              Join My Discord Community
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mb-8"
              variants={fadeIn}
            >
              Connect with me and other fans to chat, get updates, and hang out!
            </motion.p>
            <motion.a
              href="https://discord.gg/spoekle"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
                        shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition duration-300 
                        transform hover:scale-105 hover:-translate-y-1"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Discord Server
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
