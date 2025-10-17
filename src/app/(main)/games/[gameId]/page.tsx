'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { SiUnity, SiBlockbench } from 'react-icons/si';
import { BiLoaderCircle } from 'react-icons/bi';
import DefaultLayout from '@/components/DefaultLayout';
import Image from 'next/image';
import { getGameById, Game } from '../gamesData';

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

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params?.gameId as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    setLoading(true);
    const gameData = await getGameById(gameId);
    setGame(gameData || null);
    setLoading(false);
  };

  if (loading) {
    return (
      <DefaultLayout
        title="Loading..."
        subtitle="Please wait"
        backgroundImage="/assets/spoekleGame.webp"
      >
        <div className="flex justify-center items-center py-16">
          <BiLoaderCircle className="animate-spin text-5xl text-neutral-900 dark:text-white" />
        </div>
      </DefaultLayout>
    );
  }

  if (!game) {
    return (
      <DefaultLayout
        title="Game Not Found"
        subtitle="The game you're looking for doesn't exist"
        backgroundImage="/assets/spoekleGame.webp"
      >
        <div className="text-center py-20">
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
            This game page doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/games')}
            className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
          >
            Back to Gaming
          </button>
        </div>
      </DefaultLayout>
    );
  }

  const getButtonColor = (color?: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  return (
    <DefaultLayout
      title={game.name}
      subtitle={game.shortDescription}
      backgroundImage={game.image}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
        <button
          onClick={() => router.push('/games')}
          className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:bg-white/20 rounded-xl transition-all duration-300 shadow-lg dark:shadow-none font-semibold text-neutral-900 dark:text-white"
        >
          <FaArrowLeft />
          Back to Gaming
        </button>

        {/* About Section */}
        <section className="py-32 bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
              <motion.h2
                className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                variants={fadeIn}
              >
                About {game.name}
              </motion.h2>

              <motion.div className="prose prose-lg dark:prose-invert max-w-none space-y-6" variants={fadeIn}>
                {game.about.map((paragraph, index) => (
                  <p key={index} className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Review Section */}
        {game.review && (
          <section className="py-32 bg-neutral-50 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
                <motion.h2
                  className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                  variants={fadeIn}
                >
                  My Review
                </motion.h2>

                <motion.div
                  className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-10 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg dark:shadow-none"
                  variants={cardVariants}
                >
                  <p className="text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    "{game.review}"
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Downloads Section */}
        {game.downloads && game.downloads.length > 0 && (
          <section className="py-32 bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
                <motion.h2
                  className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                  variants={fadeIn}
                >
                  Downloads & Content
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {game.downloads.map((download, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                      variants={cardVariants}
                      whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                      <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                        {download.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        {download.description}
                      </p>
                      <a
                        href={download.downloadUrl}
                        download
                        className={`inline-flex items-center gap-2 px-6 py-3 ${getButtonColor(download.buttonColor)} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105`}
                      >
                        <FaDownload />
                        Download
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Images Gallery Section */}
        {game.images && game.images.length > 0 && (
          <section className="py-32 bg-neutral-50 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div className="max-w-4xl mx-auto" {...useAlwaysInView} variants={staggerContainer}>
                <motion.h2
                  className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                  variants={fadeIn}
                >
                  Gallery
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {game.images.map((image, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none overflow-hidden"
                      variants={cardVariants}
                      whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {image.caption && (
                        <div className="p-6">
                          <p className="text-base text-neutral-700 dark:text-neutral-300 text-center">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Extra Content Section */}
        {game.extraContent && (
          <section className="py-32">
            {game.extraContent}
          </section>
        )}
      </div>
    </DefaultLayout>
  );
}
