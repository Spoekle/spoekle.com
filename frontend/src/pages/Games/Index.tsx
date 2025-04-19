import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaSteam, FaDiscord, FaTwitch, FaArrowRight } from 'react-icons/fa';
import { SiUnity, SiBlockbench, SiEpicgames } from 'react-icons/si';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import BeatSaber from './components/BeatSaber';
import Minecraft from './components/Minecraft';

// Import header image
import headerImage from '../../assets/spoekleGame.webp';
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

const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

const GamesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  // Parse query parameters to determine which game to show
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gameParam = queryParams.get('game');
    setCurrentGame(gameParam);
  }, [location]);

  // Switch to another game
  const switchGame = (game: string) => {
    navigate(`/games?game=${game}`);
  };

  // Generate page title based on current game
  const getPageTitle = () => {
    if (currentGame === 'minecraft') return "Minecraft";
    if (currentGame === 'beatsaber') return "Beat Saber";
    return "Gaming";
  };

  // Generate page subtitle based on current game
  const getPageSubtitle = () => {
    if (currentGame === 'minecraft') return "Blocks, Builds, and Servers";
    if (currentGame === 'beatsaber') return "VR Rhythm Game";
    return "My favorite games and gaming content";
  };

  // Get the appropriate background image
  const getBackgroundImage = () => {
    if (currentGame === 'minecraft') return minecraftImg;
    if (currentGame === 'beatsaber') return beatSaberImg;
    return headerImage;
  };

  // Define the featured games data
  const featuredGames = [
    {
      name: "Beat Saber",
      description: "A VR rhythm game where you slash blocks with lightsabers to the beat of music.",
      image: beatSaberImg,
      id: "beatsaber",
      icon: <SiUnity className="text-white text-xl" />,
      color: "from-red-500 to-blue-600"
    },
    {
      name: "Minecraft",
      description: "A sandbox game where you can build, explore, and survive in a block-based world.",
      image: minecraftImg,
      id: "minecraft",
      icon: <SiBlockbench className="text-white text-xl" />,
      color: "from-green-500 to-emerald-700"
    }
  ];

  // Render specific game content
  const renderGameContent = () => {
    switch (currentGame) {
      case 'minecraft':
        return <Minecraft />;
      case 'beatsaber':
        return <BeatSaber />;
      default:
        return renderGamesOverview();
    }
  };

  // Render the games overview (shown when no specific game is selected)
  const renderGamesOverview = () => {
    return (
      <>
        {/* Featured Games Section */}
        <section className="py-16 md:py-24 bg-neutral-100 dark:bg-neutral-950 rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              {...useAlwaysInView}
            >
              <motion.div
                className="inline-block p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4"
                variants={fadeIn}
              >
                <FaGamepad className="text-3xl text-purple-600 dark:text-purple-400" />
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4"
                variants={fadeIn}
              >
                Featured Games
              </motion.h2>
              <motion.p
                className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                variants={fadeIn}
              >
                Here are some of the games I play regularly and create content for
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {featuredGames.map((game, index) => (
                <motion.div
                  key={game.name}
                  className="group relative overflow-hidden rounded-xl shadow-lg"
                  {...useAlwaysInView}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                      {game.icon}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-gray-200 mb-4">{game.description}</p>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => switchGame(game.id)}
                        className="px-5 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition duration-200 inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Explore {game.name} <FaArrowRight className="ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gaming Setup Section */}
        <section className="mt-4 py-16 md:py-20 bg-gray-50/70 dark:bg-neutral-900/70 rounded-xl overflow-hidden transition duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
              {...useAlwaysInView}
            >
              <motion.div
                className="md:w-1/2"
                variants={fadeIn}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-6">My Gaming Setup</h2>
                <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">PC Specs</h3>
                  <ul className="space-y-2 text-neutral-700 dark:text-gray-300">
                    <li>• CPU: AMD Ryzen 7 7800X3D</li>
                    <li>• GPU: AMD Radeon 7900XTX</li>
                    <li>• RAM: 32GB DDR5 6000MHz</li>
                    <li>• Storage: 2TB NVMe SSD + 1TB NVMe SSD</li>
                    <li>• OS: Windows 11 Pro</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mt-6 mb-4">VR Equipment</h3>
                  <ul className="space-y-2 text-neutral-700 dark:text-gray-300">
                    <li>• Headset: Valve Index</li>
                    <li>• Controllers: Valve Index Controllers</li>
                    <li>• Tracking: 2x Base Station 2.0</li>
                    <li>• Headset 2: Oculus Quest 3</li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                className="md:w-1/2"
                variants={fadeIn}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-6">Gaming Platforms</h2>
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    href="https://steamcommunity.com/id/spoekle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg flex flex-col items-center text-center"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="text-4xl mb-3 text-blue-500">
                      <FaSteam />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Steam</h3>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg flex flex-col items-center text-center"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="text-4xl mb-3 text-white">
                      <SiEpicgames />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Epic Games</h3>
                  </motion.a>
                  <motion.a
                    href="https://twitch.tv/spoekle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg flex flex-col items-center text-center"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="text-4xl mb-3 text-purple-500">
                      <FaTwitch />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Twitch</h3>
                  </motion.a>
                  <motion.a
                    href="https://discord.gg/Ha9ruZcmhE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg flex flex-col items-center text-center"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="text-4xl mb-3 text-indigo-500">
                      <FaDiscord />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Discord</h3>
                  </motion.a>
                </div>
                
                <div className="mt-6 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20 dark:border-white/10 shadow-lg">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Game Servers</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">
                    I host several game servers for my community, including Minecraft, Terraria, and others. Join my Discord to get access!
                  </p>
                  <motion.a
                    href="https://discord.gg/Ha9ruZcmhE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    Join Discord <FaDiscord className="ml-2" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </>
    );
  };

  // If we're showing a specific game, add a back button and share button
  const renderGameNav = () => {
    if (!currentGame) return null;
    
    return (
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl p-4 mb-6 flex justify-between items-center sticky top-4 z-50 border border-white/10 dark:border-white/5 shadow-lg">
        <motion.button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/20 rounded-lg hover:bg-white/30 dark:hover:bg-black/30 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-neutral-800 dark:text-white">Back to Games</span>
        </motion.button>
        
        <div className="text-center text-neutral-800 dark:text-white font-bold">
          {getPageTitle()}
        </div>
        <div/>
      </div>
    );
  };

  return (
    <DefaultLayout
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
      backgroundImage={getBackgroundImage()}
      metaDescription="Explore Spoekle's gaming content, including Beat Saber, Minecraft, and more. Find guides, servers, and resources."
    >
      {renderGameNav()}
      {renderGameContent()}
    </DefaultLayout>
  );
};

export default GamesPage;
