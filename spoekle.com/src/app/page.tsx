'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { FaYoutube, FaGithub, FaCode, FaGamepad, FaTwitch, FaArrowRight } from 'react-icons/fa';
import { BiLinkExternal } from 'react-icons/bi';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ScrollIndicator from '@/components/ScrollIndicator';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Animation variants  
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1
  }
};

interface FeaturedItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: string;
  order: number;
  active: boolean;
}

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoadingFeatured(true);
      const response = await axios.get('/api/featured');
      const data = response.data.data || response.data;
      setFeaturedItems(data);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-8"
          >
                        <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white leading-tight">
                SPOEKLE
              </h1>
              <div className="h-1 w-32 mx-auto bg-white rounded-full" />
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Developer • Content Creator • Gamer
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Crafting digital experiences through code, gaming content, and creative projects
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 justify-center pt-8"
            >
              <motion.a
                href="https://github.com/Spoekle"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center gap-3">
                  <FaGithub className="text-2xl text-white" />
                  <span className="text-white font-semibold text-lg">GitHub</span>
                </div>
              </motion.a>

              <motion.a
                href="https://youtube.com/@spoekle"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center gap-3">
                  <FaYoutube className="text-2xl text-white" />
                  <span className="text-white font-semibold text-lg">YouTube</span>
                </div>
              </motion.a>

              <motion.a
                href="https://twitch.tv/spoekle"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center gap-3">
                  <FaTwitch className="text-2xl text-white" />
                  <span className="text-white font-semibold text-lg">Twitch</span>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* What I Do Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              What I Do
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Exploring the intersection of technology, creativity, and gaming
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaCode className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Development</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Building modern web applications with React, Next.js, Node.js, and cutting-edge technologies.
                </p>
                <motion.button
                  onClick={() => router.push('/portfolio')}
                  className="flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all"
                  whileHover={{ x: 5 }}
                >
                  View Projects <BiLinkExternal />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaGamepad className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Gaming</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Creating content for Beat Saber, Minecraft, and other games. Streaming and sharing gaming adventures.
                </p>
                <motion.button
                  onClick={() => router.push('/games')}
                  className="flex items-center gap-2 text-purple-400 font-semibold hover:gap-3 transition-all"
                  whileHover={{ x: 5 }}
                >
                  Explore Gaming <BiLinkExternal />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative md:col-span-2 lg:col-span-1"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MdOutlinePhotoCamera className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Photography</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Capturing moments through landscape and creative photography. Exploring visual storytelling.
                </p>
                <motion.button
                  onClick={() => router.push('/photography')}
                  className="flex items-center gap-2 text-amber-400 font-semibold hover:gap-3 transition-all"
                  whileHover={{ x: 5 }}
                >
                  View Gallery <BiLinkExternal />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-950/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
              Featured
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Check out my latest projects and creative work
            </p>
          </motion.div>

          {loadingFeatured ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin w-16 h-16 border-4 border-white rounded-full border-t-transparent"></div>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No featured items to display</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={scaleIn}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  onClick={() => router.push(item.linkUrl)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                    <h3 className="text-4xl font-black text-white mb-3">{item.title}</h3>
                    <p className="text-gray-200 text-lg mb-6">
                      {item.description}
                    </p>
                    <motion.div
                      className="inline-flex items-center gap-2 text-white font-semibold"
                      whileHover={{ x: 5 }}
                    >
                      Explore <BiLinkExternal />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={scaleIn}>
              <Image
                src="/assets/spoekleMe.webp"
                alt="Spoekle"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl w-full"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white">
                About Me
              </h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <p>
                  Hey there! I'm Spoekle, a passionate developer who loves building things that make a difference.
                </p>
                <p>
                  When I'm not coding, you'll find me playing Beat Saber, capturing moments through photography,
                  exploring in Minecraft, or creating content for my community.
                </p>
                <p>
                  This site is my digital playground—a place where I showcase my projects, share my gaming adventures,
                  and document my creative journey.
                </p>
              </div>
              <motion.button
                onClick={() => router.push('/about')}
                className="mt-8 px-8 py-4 bg-white text-neutral-900 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Me
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
