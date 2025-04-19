import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaDiscord, FaGlobe, FaLock, FaUsers, FaInfoCircle, FaMap } from 'react-icons/fa';
import { SiBlockbench } from 'react-icons/si';

// Import images
import headerImage from '../../../assets/minecraft.webp';
import forgeImg from '../../../assets/Minecraft-Forge-logo.webp';
import vanillaImg from '../../../assets/vanilla.webp';
import bluemapImg from '../../../assets/bluemap.png';
import dynmapImg from '../../../assets/dynmap.png';
import wintertownImg from '../../../assets/wintertown.png';

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

const Minecraft: React.FC = () => {
  const servers = [
    {
      name: "Survival Server",
      description: "Pure vanilla survival experience with minimal plugins for protection and quality of life.",
      version: "1.20.4",
      address: "Offline",
      type: "Vanilla",
      image: vanillaImg,
      features: ["Survival"],
      color: "from-green-500 to-green-700",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      name: "Modded Server",
      description: "Create Reforged modpack with tech, magic, and exploration mods for advanced gameplay.",
      version: "1.20.4",
      address: "Offline",
      type: "Fabric",
      image: forgeImg,
      features: ["20+ Mods", "Player Shops", "Tech Progression"],
      color: "from-orange-500 to-red-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    }
  ];

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
            <motion.div className="md:w-1/2" variants={fadeInLeft}>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-6">Minecraft Community</h2>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Welcome to my Minecraft hub! I've been playing Minecraft since 2011 and have spent a lot of time in this game.
                Since a few years, I also host servers! Whether you're into vanilla survival, modded gameplay, or just 
                building amazing structures, there's something here for you.
              </p>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Our servers are configured for optimal performance and gameplay experience, with 
                active moderation and regular events to keep things fresh and engaging. All done using Crafty!
              </p>
              
              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                variants={fadeIn}
              >
                <motion.a
                  href="https://discord.gg/Ha9ruZcmhE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDiscord />
                  <span className="font-medium">Join Discord</span>
                </motion.a>
                <motion.a
                  href="https://minecraft.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-neutral-800 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SiBlockbench className="text-green-600 dark:text-green-400" />
                  <span className="text-neutral-800 dark:text-white font-medium">Official Site</span>
                </motion.a>
              </motion.div>
            </motion.div>
            
            <motion.div className="md:w-1/2" variants={fadeInRight}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src={wintertownImg} 
                    alt="Winter Town Build" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover transform -rotate-2 hover:rotate-0 transition duration-500"
                  />
                  <img 
                    src={bluemapImg} 
                    alt="BlueMap View" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover transform rotate-2 hover:rotate-0 transition duration-500"
                  />
                </div>
                <div className="pt-6 space-y-4">
                  <img 
                    src={dynmapImg} 
                    alt="Dynmap View" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover transform rotate-3 hover:rotate-0 transition duration-500"
                  />
                  <img 
                    src={headerImage} 
                    alt="Minecraft Landscape" 
                    className="rounded-lg shadow-lg h-40 w-full object-cover transform -rotate-3 hover:rotate-0 transition duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Servers Section */}
      <section className="mt-4 py-16 md:py-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl overflow-hidden transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...useAlwaysInView}
          >
            <motion.div
              className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
              variants={fadeIn}
            >
              <FaServer className="text-3xl text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4"
              variants={fadeIn}
            >
              Our Minecraft Servers
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Join our community and play on these carefully crafted servers
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servers.map((server, index) => (
              <motion.div
                key={server.name}
                className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
                {...useAlwaysInView}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${server.color} opacity-50 z-10`}></div>
                  <img 
                    src={server.image} 
                    alt={server.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 px-3 py-1 rounded-full text-sm font-medium z-20">
                    {server.type}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-neutral-900/90 px-3 py-1 rounded-full text-sm font-medium z-20">
                    MC {server.version}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">{server.name}</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">{server.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {server.features.map((feature) => (
                      <span 
                        key={feature} 
                        className="text-xs font-medium px-2 py-1 bg-white/50 dark:bg-neutral-800/50 rounded-full text-neutral-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded-lg text-neutral-700 dark:text-gray-300 text-sm font-mono">
                      {server.address}
                    </div>
                    <motion.button
                      className={`px-4 py-2 text-white rounded-lg transition duration-200 ${server.buttonColor}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigator.clipboard.writeText(server.address)}
                    >
                      Copy Address
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="mt-12 backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
            {...useAlwaysInView}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <FaInfoCircle className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">Server Rules</h3>
                <ul className="list-disc pl-5 text-neutral-700 dark:text-gray-300 space-y-2">
                  <li>Be respectful to all players</li>
                  <li>No griefing or stealing from other players</li>
                  <li>No excessive profanity or inappropriate content</li>
                  <li>No cheating, hacking, or using exploits</li>
                  <li>Keep chat civil and appropriate</li>
                  <li>Have fun and be creative!</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Server Features Section */}
      <section className="mt-4 py-16 md:py-20 bg-gray-50/70 dark:bg-neutral-900/70 rounded-xl overflow-hidden transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...useAlwaysInView}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4"
              variants={fadeIn}
            >
              Server Features
            </motion.h2>
            <motion.p
              className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Explore what makes our Minecraft community special
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-6">
                <FaMap className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">Interactive Maps</h3>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Explore our servers with real-time interactive maps powered by BlueMap. See where players are, view amazing builds, and navigate to interesting locations.
              </p>
              <motion.a
                href="#"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
                whileHover={{ x: 5 }}
              >
                View Maps <FaGlobe className="ml-2" />
              </motion.a>
            </motion.div>
            
            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-6">
                <FaLock className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">Fast and Secure</h3>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Our servers are hosted on high-performance hardware with DDoS protection and regular backups to ensure a smooth and secure gaming experience.
              </p>
              <motion.a
                href="#"
                className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:underline"
                whileHover={{ x: 5 }}
              >
                Server Specs <FaServer className="ml-2" />
              </motion.a>
            </motion.div>
            
            <motion.div
              className="backdrop-blur-md bg-white/40 dark:bg-white/5 rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-lg transition duration-200"
              {...useAlwaysInView}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center mb-6">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">Community Events</h3>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Regular community events including building competitions, treasure hunts, PvP tournaments, and collaborative projects to bring players together.
              </p>
              <motion.a
                href="https://discord.gg/Ha9ruZcmhE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline"
                whileHover={{ x: 5 }}
              >
                Join Discord for Events <FaDiscord className="ml-2" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Community & Discord Section */}
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
              Join Our Minecraft Community
            </motion.h2>
            <motion.p
              className="text-xl text-neutral-700 dark:text-gray-300 max-w-2xl mb-8 transition duration-200"
              variants={fadeIn}
            >
              Connect with other players, get server announcements, and participate in community events
            </motion.p>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mb-8">
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">Server Announcements</h3>
                <p className="text-neutral-700 dark:text-gray-300">Stay updated with the latest server news, updates, and maintenance schedules</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">Community Chat</h3>
                <p className="text-neutral-700 dark:text-gray-300">Connect with other players, share your builds, and make new friends</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">Server Support</h3>
                <p className="text-neutral-700 dark:text-gray-300">Get help with server issues, mod installation, and gameplay questions</p>
              </div>
            </motion.div>
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
    </>
  );
};

export default Minecraft;
