'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGamepad, FaSteam, FaArrowRight, FaDesktop } from 'react-icons/fa';
import { SiUnity, SiBlockbench } from 'react-icons/si';
import { MdHeadset } from 'react-icons/md';
import { BiLoaderCircle } from 'react-icons/bi';
import DefaultLayout from '@/components/DefaultLayout';
import Image from 'next/image';
import { fetchGames, Game } from './gamesData';

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

// Icon mapping
const iconMap: Record<string, React.ReactElement> = {
  SiUnity: <SiUnity className="text-white text-xl" />,
  SiBlockbench: <SiBlockbench className="text-white text-xl" />
};

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    const gamesData = await fetchGames();
    setGames(gamesData);
    setLoading(false);
  };

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
    <DefaultLayout
      title="Gaming"
      subtitle="My favorite games and gaming content"
      backgroundImage="/assets/spoekleGame.webp"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
        {/* Featured Games Section */}
        <section className="py-32 bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="text-center mb-20" {...useAlwaysInView}>
              <motion.div
                className="inline-block p-4 rounded-2xl bg-neutral-900 dark:bg-white mb-6"
                variants={fadeIn}
              >
                <FaGamepad className="text-4xl text-white dark:text-neutral-900" />
              </motion.div>
              <motion.h2
                className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6"
                variants={fadeIn}
              >
                Featured Games
              </motion.h2>
              <motion.p
                className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                variants={fadeIn}
              >
                Here are some of the games I play regularly and create content for
              </motion.p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <BiLoaderCircle className="animate-spin text-5xl text-neutral-900 dark:text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none cursor-pointer"
                  {...useAlwaysInView}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  onClick={() => router.push(`/games/${game.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
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
                      {iconMap[game.icon]}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-white/90 mb-4">{game.shortDescription}</p>
                    <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Gaming Setup Section */}
        <section className="py-32 bg-neutral-50 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-16 text-center"
                variants={fadeIn}
              >
                My Gaming Setup
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Left Column - PC Specs & VR Equipment */}
                <div className="space-y-8">
                  <motion.div variants={cardVariants}>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                        <FaDesktop />
                      </div>
                      <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">PC Specs</h3>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
                      <div className="space-y-4">
                        {pcSpecs.map((item, index) => (
                          <div key={index} className="flex">
                            <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                            <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants}>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                        <MdHeadset />
                      </div>
                      <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">VR Equipment</h3>
                    </div>
                    <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
                      <div className="space-y-4">
                        {vrEquipment.map((item, index) => (
                          <div key={index} className="flex">
                            <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                            <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Gaming Platforms */}
                <motion.div variants={cardVariants}>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                      <FaGamepad />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Gaming Platforms</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {platforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <motion.div
                          className={`bg-gradient-to-br ${platform.color} p-8 rounded-2xl text-white transition-all shadow-lg dark:shadow-none`}
                          whileHover={{ y: -10, transition: { duration: 0.3 }, scale: 1.02 }}
                        >
                          <div className="flex flex-col items-center text-center">
                            {platform.icon}
                            <h4 className="text-xl font-bold mt-4">{platform.name}</h4>
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
      </div>
    </DefaultLayout>
  );
}
