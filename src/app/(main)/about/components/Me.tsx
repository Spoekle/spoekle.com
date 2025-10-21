'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaGamepad, FaServer, FaYoutube } from 'react-icons/fa';

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

const skillCardVariants = {
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

export default function Me() {
    return (
        <div className="space-y-16">
            {/* Bio Section */}
            <section className="py-32 bg-neutral-200/40 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        {...useAlwaysInView}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                            variants={fadeIn}
                        >
                            Who I Am
                        </motion.h2>

                        <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
                            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                                Hi there! I'm Spoekle, a passionate developer, content creator, photographer and gamer from the Netherlands. 
                                I've been building web applications and creating content for several years, with a focus on modern web technologies and gaming experiences.
                            </p>

                            <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                                My journey in tech began all the way back in 2015 (when I was 10). At that time I got my first computer and started viewing a lot of hardware
                                related videos. This sparked my interest in technology, leading me to experiment with simple website development, 
                                which quickly evolved into a deep passion for creating interactive web applications and later desktop applications using modern frameworks like React, Node.js and Electron. 
                                I'm particularly interested in building applications that automate workflows or make them faster, whether it's for my own benefit, or for others.
                            </p>

                            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                When I'm not coding, you'll likely find me editing content for YouTube, outside taking pictures, reading a book, or diving into the latest "friendslop" games. 
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* What I Do Section */}
            <section className="py-32 bg-neutral-200/70 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl">
                <div className="container mx-auto px-4 md:px-8">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        {...useAlwaysInView}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
                            variants={fadeIn}
                        >
                            What I Do
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <motion.div
                                className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                                variants={skillCardVariants}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                                    <FaCode />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Web Development</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    I build modern web applications using React, TypeScript, and Node.js. My focus is on creating responsive, accessible, and performant experiences that users love.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                                variants={skillCardVariants}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                                    <FaYoutube />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Content Creation</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    I edit videos for multiple channels, including BSTS, which hosts Beat Saber Tournaments.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                                variants={skillCardVariants}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                                    <FaGamepad />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Gaming</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    I have a particular focus on multiplayer games which I play with my friends.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-8 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                                variants={skillCardVariants}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                                    <FaServer />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Homeserver</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    I host my own homeserver for various applications, including game servers, media servers, and more. I enjoy the challenge of setting up and maintaining my own infrastructure.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
