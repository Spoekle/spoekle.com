import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitch, FaYoutube, FaCog, FaInfoCircle } from 'react-icons/fa';
import { SiSteam, SiOculus } from 'react-icons/si';

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

// Helper function to ensure animations always display
const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

const BeatSaber: React.FC = () => {
  const settings = {
    Graphics: [
      { setting: "Anti-Aliasing", value: "Off" },
      { setting: "Render Scale", value: "100%" },
      { setting: "Bloom", value: "On" },
      { setting: "Mirror Quality", value: "High" },
      { setting: "Smoke", value: "On" },
      { setting: "Screen Distortion Effects", value: "Off" }
    ],
    Gameplay: [
      { setting: "Static Lights", value: "On" },
      { setting: "Reduce Debris", value: "On" },
      { setting: "Advanced HUD", value: "On" },
      { setting: "Player Height", value: "0.1m under default" }
    ],
    Config: [
      { name: "Saber Offsets", download: "SpoekleQuest3Offsets.json" },
      { name: "HSV", download: "SpoekleHSV.json" }
    ]
  };

  return (
    <>
      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
            {...useAlwaysInView}
            variants={staggerChildren}
          >
            <motion.div className="md:w-1/2" variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-6">About Beat Saber</h2>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Beat Saber is a VR rhythm game where you slash blocks with lightsabers in time to music. It's one of my 
                favorite VR games, and I've spent hundreds of hours playing it.
              </p>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                On this page, you'll find my settings, recommended mods, favorite maps, and other resources to help you 
                get the most out of your Beat Saber experience.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <motion.a
                  href="https://store.steampowered.com/app/620980/Beat_Saber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-neutral-800 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SiSteam className="text-blue-600 dark:text-blue-400" />
                  <span className="text-neutral-800 dark:text-white font-medium">Steam Store</span>
                </motion.a>
                <motion.a
                  href="https://www.oculus.com/experiences/quest/2448060205267927/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-neutral-800 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SiOculus className="text-blue-600 dark:text-blue-400" />
                  <span className="text-neutral-800 dark:text-white font-medium">Meta Store</span>
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div className="md:w-1/2" variants={fadeIn}>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/vL39Sg2AqWg"
                  title="Beat Saber Official Trailer"
                  className="w-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* My Setup & Settings */}
      <section className="mt-4 py-16 md:py-20 bg-gray-50/70 dark:bg-neutral-900/70 rounded-xl overflow-hidden transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...useAlwaysInView}
          >
            <motion.div
              className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4"
              variants={fadeIn}
            >
              <FaCog className="text-3xl text-blue-600 dark:text-blue-400" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4"
              variants={fadeIn}
            >
              My Settings
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              These are the settings I use for Beat Saber :D
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600 dark:text-blue-400" />
                Graphics Settings
              </h3>
              
              <div className="space-y-4">
                {settings.Graphics.map((item, index) => (
                  <div 
                    key={`graphics-${index}`}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700"
                  >
                    <span className="text-neutral-700 dark:text-gray-300">{item.setting}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600 dark:text-blue-400" />
                Gameplay Settings
              </h3>
              
              <div className="space-y-4">
                {settings.Gameplay.map((item, index) => (
                  <div 
                    key={`gameplay-${index}`}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700"
                  >
                    <span className="text-neutral-700 dark:text-gray-300">{item.setting}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600 dark:text-blue-400" />
                Configs
              </h3>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                I use the following configs for my Beat Saber setup:
              </p>
              <div className="space-y-4">
                {settings.Config.map((item, index) => (
                  <div 
                    key={`config-${index}`}
                    className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-neutral-700"
                  >
                    <a href={`/download/${item.download}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium">
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* My Streams & Content */}
      <section className="mt-4 py-16 bg-indigo-100/50 dark:bg-indigo-950/30 backdrop-blur-lg rounded-xl overflow-hidden transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...useAlwaysInView}
          >
            <motion.div
              className="inline-block p-3 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
              variants={fadeIn}
            >
              <FaTwitch className="text-3xl text-red-600 dark:text-red-400" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4"
              variants={fadeIn}
            >
              My Beat Saber Content
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Watch me play and learn from my gameplay
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="https://twitch.tv/spoekle"
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200 flex flex-col items-center text-center"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-4">
                <FaTwitch className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Twitch Streams</h3>
              <p className="text-neutral-700 dark:text-gray-300">I rarely stream Beat Saber on Twitch. But when I do, come watch me play and chat!</p>
            </motion.a>
            
            <motion.a
              href="https://youtube.com/@spoekle"
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200 flex flex-col items-center text-center"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
                <FaYoutube className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">YouTube Videos</h3>
              <p className="text-neutral-700 dark:text-gray-300">Check out my Beat Saber gameplay on YouTube.</p>
            </motion.a>
          </div>
        </div>
      </section>
    </>
  );
};

export default BeatSaber;
