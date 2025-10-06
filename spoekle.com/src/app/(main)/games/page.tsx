'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGamepad, FaSteam, FaTwitch, FaArrowRight, FaArrowLeft, FaDesktop } from 'react-icons/fa';
import { SiUnity, SiBlockbench, SiEpicgames } from 'react-icons/si';
import { MdHeadset } from 'react-icons/md';
import DefaultLayout from '@/components/DefaultLayout';
import Image from 'next/image';
import Link from 'next/link';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  // Parse query parameters to determine which game to show
  useEffect(() => {
    const gameParam = searchParams.get('game');
    setCurrentGame(gameParam);
  }, [searchParams]);

  // Switch to another game
  const switchGame = (game: string) => {
    router.push(`/games?game=${game}`);
  };

  // Go back to overview
  const goBack = () => {
    router.push('/games');
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
    if (currentGame === 'minecraft') return "/assets/minecraft.webp";
    if (currentGame === 'beatsaber') return "/assets/beat-saber-5.jpg";
    return "/assets/spoekleGame.webp";
  };

  // Define the featured games data
  const featuredGames = [
    {
      name: "Beat Saber",
      description: "A VR rhythm game where you slash blocks with lightsabers to the beat of music.",
      image: "/assets/beat-saber-5.jpg",
      id: "beatsaber",
      icon: <SiUnity className="text-white text-xl" />,
      color: "from-red-500 to-blue-600"
    },
    {
      name: "Minecraft",
      description: "A sandbox game where you can build, explore, and survive in a block-based world.",
      image: "/assets/minecraft.webp",
      id: "minecraft",
      icon: <SiBlockbench className="text-white text-xl" />,
      color: "from-green-500 to-emerald-700"
    }
  ];

  // Render specific game content
  const renderGameContent = () => {
    switch (currentGame) {
      case 'minecraft':
        return renderMinecraft();
      case 'beatsaber':
        return renderBeatSaber();
      default:
        return renderGamesOverview();
    }
  };

  // Render Beat Saber content
  const renderBeatSaber = () => {
    return (
      <>
        <button
          onClick={goBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <FaArrowLeft />
          Back to Gaming
        </button>

        <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl shadow-lg mb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-purple-500 pb-2"
                variants={fadeIn}
              >
                About Beat Saber
              </motion.h2>

              <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  Beat Saber is one of my favorite VR games! It's an immersive rhythm experience where you slash
                  the beats of adrenaline-pumping music as they fly towards you. The combination of music, movement,
                  and lightsabers creates an incredible workout and gaming experience.
                </p>

                <p className="text-neutral-700 dark:text-gray-300">
                  I regularly play custom maps and have even created some of my own. I also create content
                  showcasing gameplay, custom sabers, and modding tutorials.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl shadow-lg mb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-indigo-500 pb-2"
                variants={fadeIn}
              >
                Downloads & Content
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                  variants={cardVariants}
                >
                  <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Custom Avatar</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">
                    My custom Beat Saber avatar optimized for Quest 3, featuring unique styling and smooth performance.
                  </p>
                  <a
                    href="/download/SpoekleHSV.json"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Download Avatar
                  </a>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                  variants={cardVariants}
                >
                  <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Quest 3 Offsets</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">
                    Optimized offset configuration for perfect avatar positioning on Meta Quest 3.
                  </p>
                  <a
                    href="/download/SpoekleQuest3Offsets.json"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Download Offsets
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  };

  // Render Minecraft content
  const renderMinecraft = () => {
    return (
      <>
        <button
          onClick={goBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <FaArrowLeft />
          Back to Gaming
        </button>

        <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl shadow-lg mb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-green-500 pb-2"
                variants={fadeIn}
              >
                About Minecraft
              </motion.h2>

              <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  Minecraft is where creativity meets adventure! I've been playing since the early days and have
                  built everything from massive cities to intricate redstone contraptions. The endless possibilities
                  keep me coming back.
                </p>

                <p className="text-neutral-700 dark:text-gray-300">
                  I run my own Minecraft server featuring custom plugins, unique game modes, and an active community.
                  I also create technical builds, farms, and share building tips and tricks.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl shadow-lg">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-emerald-500 pb-2"
                variants={fadeIn}
              >
                Server & Projects
              </motion.h2>

              <div className="space-y-6">
                <motion.div
                  className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                  variants={cardVariants}
                >
                  <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Minecraft Server</h3>
                  <p className="text-neutral-700 dark:text-gray-300 mb-4">
                    Join my Minecraft server for survival gameplay, custom plugins, and community events.
                  </p>
                  <div className="bg-neutral-200 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Server IP:</span>
                      <span className="text-green-600 dark:text-green-400">Coming Soon</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                  variants={cardVariants}
                >
                  <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Featured Projects</h3>
                  <ul className="space-y-3 text-neutral-700 dark:text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 mt-1">▸</span>
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Automated Farm Complex</strong>
                        <p>Fully automated farming system with storage and sorting</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 mt-1">▸</span>
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Modern City District</strong>
                        <p>Contemporary architecture with functional buildings</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 mt-1">▸</span>
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Redstone Computer</strong>
                        <p>Working calculator built with redstone circuits</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  };

  // Render the games overview (shown when no specific game is selected)
  const renderGamesOverview = () => {
    const pcSpecs = [
      { name: 'CPU', description: 'AMD Ryzen 7 7800X3D' },
      { name: 'GPU', description: 'AMD Radeon 7900XTX' },
      { name: 'RAM', description: '32GB DDR5 6000MHz' },
      { name: 'Storage', description: '2TB NVMe SSD + 1TB NVMe SSD' },
      { name: 'Monitor', description: '34" 1440P 144Hz Ultrawide' }
    ];

    const vrEquipment = [
      { name: 'Headset', description: 'Oculus Quest 3' },
      { name: 'Headset 2', description: 'Valve Index w/ 2 Base Stations & Knuckles' }
    ];

    const platforms = [
      {
        name: 'Steam',
        icon: <FaSteam className="text-4xl" />,
        color: 'from-blue-500 to-blue-700',
        link: 'https://steamcommunity.com/id/Spoekle'
      }
    ];

    return (
      <>
        {/* Featured Games Section */}
        <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl shadow-lg mb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="text-center mb-16" {...useAlwaysInView}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {featuredGames.map((game, index) => (
                <motion.div
                  key={game.name}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                  {...useAlwaysInView}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => switchGame(game.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                  <div className="relative w-full h-64 md:h-80">
                    <Image 
                      src={game.image} 
                      alt={game.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                      {game.icon}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-white/90 mb-4">{game.description}</p>
                    <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gaming Setup Section */}
        <section className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl shadow-lg mb-12">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-12 text-center"
                variants={fadeIn}
              >
                My Gaming Setup
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Left Column - PC Specs & VR Equipment */}
                <div className="space-y-8">
                  <motion.div variants={cardVariants}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                        <FaDesktop />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">PC Specs</h3>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                      <div className="space-y-3">
                        {pcSpecs.map((item, index) => (
                          <div key={index} className="flex">
                            <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                            <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                        <MdHeadset />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">VR Equipment</h3>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                      <div className="space-y-3">
                        {vrEquipment.map((item, index) => (
                          <div key={index} className="flex">
                            <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                            <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Gaming Platforms */}
                <motion.div variants={cardVariants}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                      <FaGamepad />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Gaming Platforms</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {platforms.map((platform, index) => (
                      <a
                        key={platform.name}
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <motion.div
                          className={`bg-gradient-to-br ${platform.color} p-6 rounded-xl shadow-lg text-white transition-all group-hover:shadow-2xl group-hover:scale-105`}
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex flex-col items-center text-center">
                            {platform.icon}
                            <h4 className="text-lg font-bold mt-3">{platform.name}</h4>
                          </div>
                        </motion.div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  };

  return (
    <DefaultLayout
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
      backgroundImage={getBackgroundImage()}
    >
      {renderGameContent()}
    </DefaultLayout>
  );
}
