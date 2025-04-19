import { motion } from 'framer-motion';
import { FaDiscord, FaYoutube, FaGithub, FaCode, FaGamepad, FaTwitch, FaArrowRight } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import DefaultLayout from '../../layouts/DefaultLayout';
import { NavLink, useNavigate } from 'react-router-dom';

// Import header image for static header
import headerImage from '../../assets/slider/slider1.webp';

import spoekle from '../../assets/spoekleMe.webp';
import minecraftImg from '../../assets/minecraft.webp';
import beatSaberImg from '../../assets/beat-saber-5.jpg';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
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

// Helper function to ensure animations always display
const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  // Fallback for components that need whileInView
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <DefaultLayout
        title="Spoekle's Hub"
        subtitle="Welcome to my personal hub"
        backgroundImage={headerImage}
        metaDescription="Welcome to Spoekle's Hub - a place for all things Spoekle including content creation, development, and gaming adventures."
      >
        {/* About Me Section with Glass Card */}
        <section className="py-16 md:py-24 bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
              {...useAlwaysInView}
              variants={staggerChildren}
            >
              <motion.div
                className="md:w-1/2 px-4"
                variants={fadeInLeft}
              >
                <img
                  src={spoekle}
                  alt="Spoekle"
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform -rotate-3 hover:rotate-0 transition duration-500"
                />
              </motion.div>
              <motion.div
                className="md:w-1/2 px-4"
                variants={fadeInRight}
              >
                <div className="backdrop-blur-md bg-white/30 dark:bg-white/10 rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-xl transition duration-200">
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-6 transition duration-200">About Me</h2>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4 transition duration-200">
                    Hey there! I'm Spoekle, a passionate developer, content creator, and gamer.
                  </p>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4 transition duration-200">
                    When I'm not coding, you'll find me playing Beat Saber, taking pictures outside, exploring in Minecraft,
                    or creating content.
                  </p>
                  <p className="text-neutral-700 dark:text-gray-300 mb-6 transition duration-200">
                    This site serves as a hub for all my projects, gaming adventures, and random creative endeavors.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center mt-6">
                    <motion.a 
                      href="https://github.com/Spoekle" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-neutral-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-neutral-700/80 transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaGithub className="text-neutral-800 dark:text-white" />
                      <span className="text-neutral-800 dark:text-white">GitHub</span>
                    </motion.a>
                    <motion.a 
                      href="https://youtube.com/@spoekle" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-neutral-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-neutral-700/80 transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaYoutube className="text-neutral-800 dark:text-white" />
                      <span className="text-neutral-800 dark:text-white">YouTube</span>
                    </motion.a>
                    <motion.a 
                      href="https://twitch.tv/spoekle" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-neutral-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-neutral-700/80 transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTwitch className="text-neutral-800 dark:text-white" />
                      <span className="text-neutral-800 dark:text-white">Twitch</span>
                    </motion.a>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-center mt-6"
                  >
                    <NavLink
                      to="/about"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500/50 dark:bg-indigo-600/50 rounded-lg hover:bg-indigo-500/80 dark:hover:bg-indigo-600/80 transition duration-200"
                    >
                      <span className="text-white font-bold">More about me!</span>
                      <FaArrowRight className="text-white" />
                    </NavLink>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="mt-4 py-16 md:py-20 bg-gray-50/70 dark:bg-neutral-900/70 rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="mb-12 text-center"
              {...useAlwaysInView}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4">What I Do</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Here are some of the things I'm passionate about
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
                {...useAlwaysInView}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                  <FaCode className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Software Development</h3>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  I create websites, applications, and tools using modern web technologies like React, Node.js, and TypeScript.
                </p>
                <motion.button
                  onClick={() => navigate('/portfolio')}
                  className="mt-2 flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  whileHover={{ x: 5 }}
                >
                  View my projects <BiLinkExternal className="ml-1" />
                </motion.button>
              </motion.div>
              
              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
                {...useAlwaysInView}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-6">
                  <FaGamepad className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Gaming Content</h3>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  I create gaming content, live streams, and tutorials for games like Beat Saber and Minecraft.
                </p>
                <motion.button
                  onClick={() => navigate('/games')}
                  className="mt-2 flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline"
                  whileHover={{ x: 5 }}
                >
                  See my gaming content <BiLinkExternal className="ml-1" />
                </motion.button>
              </motion.div>
              
              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200 md:col-span-2 lg:col-span-1"
                {...useAlwaysInView}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                  <MdOutlinePhotoCamera className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Photography</h3>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  I capture moments through photography, specializing in landscape and creative shots.
                </p>
                <motion.button
                  onClick={() => navigate('/photography')}
                  className="mt-2 flex items-center text-amber-600 dark:text-amber-400 font-medium hover:underline"
                  whileHover={{ x: 5 }}
                >
                  View my gallery <BiLinkExternal className="ml-1" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="mt-4 py-16 md:py-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="mb-12 text-center"
              {...useAlwaysInView}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4">Featured Content</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Check out some of my latest games and projects
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div 
                className="group relative overflow-hidden rounded-xl shadow-lg"
                {...useAlwaysInView}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img src={beatSaberImg} alt="Beat Saber" className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2">Beat Saber</h3>
                  <p className="text-gray-200 mb-4">Find settings, configs, custom maps and tools for Beat Saber here.</p>
                  <motion.button
                    onClick={() => navigate('/games/beat-saber')}
                    className="px-5 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Beat Saber
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div 
                className="group relative overflow-hidden rounded-xl shadow-lg"
                {...useAlwaysInView}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img src={minecraftImg} alt="Minecraft" className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2">Minecraft</h3>
                  <p className="text-gray-200 mb-4">Check out my servers, modpacks, etc.</p>
                  <motion.button
                    onClick={() => navigate('/games/minecraft')}
                    className="px-5 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Minecraft
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Discord Link Section */}
        <section className="mt-4 py-16 bg-indigo-100/50 dark:bg-indigo-950/30 backdrop-blur-lg rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col items-center text-center"
              {...useAlwaysInView}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center mb-6 transition duration-200"
                variants={fadeIn}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <FaDiscord size={40} className="text-white" />
              </motion.div>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-4 transition duration-200"
                variants={fadeIn}
              >
                Join My Discord Community
              </motion.h2>
              <motion.p
                className="text-xl text-neutral-700 dark:text-gray-300 max-w-2xl mb-8 transition duration-200"
                variants={fadeIn}
              >
                Connect with me and other fans to chat, get updates, and hang out!
              </motion.p>
              <motion.a
                href="https://discord.gg/Ha9ruZcmhE"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white font-medium 
                        shadow-lg shadow-indigo-500/30 dark:shadow-indigo-600/30 hover:shadow-indigo-500/50 dark:hover:shadow-indigo-600/50 transition duration-300 
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
      </DefaultLayout>
    </>
  );
};

export default HomePage;
