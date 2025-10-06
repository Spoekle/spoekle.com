'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaGamepad, FaTiktok, FaServer, FaDesktop, FaCamera } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiJavascript, SiMysql, SiSharp, SiPython, SiUnity, SiBlender, SiTailwindcss, SiExpress, SiAdobepremierepro, SiAdobelightroom, SiAdobephotoshop, SiTypescript } from 'react-icons/si';
import DefaultLayout from '@/components/DefaultLayout';

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

export default function AboutPage() {
  const skills = [
    { icon: <SiBlender />, name: 'Blender', color: 'text-yellow-400' },
    { icon: <SiUnity />, name: 'Unity', color: 'text-green-600' },
    { icon: <SiSharp />, name: 'C#', color: 'text-purple-600' },
    { icon: <SiAdobepremierepro />, name: 'Adobe Premiere Pro', color: 'text-purple-800' },
    { icon: <SiAdobelightroom />, name: 'Adobe Lightroom', color: 'text-blue-500' },
    { icon: <SiAdobephotoshop />, name: 'Adobe Photoshop', color: 'text-blue-400' },
  ];

  const languages = [
    { icon: <SiTypescript />, name: 'TypeScript', color: 'text-blue-600' },
    { icon: <SiJavascript />, name: 'JavaScript', color: 'text-yellow-400' },
    { icon: <SiMysql />, name: 'MySQL', color: 'text-green-600' },
    { icon: <SiSharp />, name: 'C#', color: 'text-purple-600' },
    { icon: <SiPython />, name: 'Python', color: 'text-yellow-500' },
  ];

  const frameworks = [
    { icon: <SiReact />, name: 'React', color: 'text-blue-400' },
    { icon: <SiTailwindcss />, name: 'TailwindCSS', color: 'text-cyan-500' },
    { icon: <SiExpress />, name: 'Express', color: 'dark:text-white text-neutral-800' },
    { icon: <SiNodedotjs />, name: 'Node.js', color: 'text-green-600' },
    { icon: <SiMongodb />, name: 'MongoDB', color: 'text-green-500' },
  ];

  const pcSetup = [
    { name: 'CPU', description: 'AMD Ryzen 7 7800X3D' },
    { name: 'GPU', description: 'AMD Radeon 7900XTX' },
    { name: 'Mobo', description: 'Gigabyte B650E AORUS ELITE X AX ICE' },
    { name: 'PSU', description: 'be quiet! Pure Power 11 850W' },
    { name: 'Cooling', description: 'Cooler Master ML240L V2 RGB White' },
    { name: 'RAM', description: '32GB DDR5 6000MHz' },
    { name: 'Storage', description: '2TB NVMe SSD + 1TB NVMe SSD' },
    { name: 'Case', description: 'Fractal Design Pop Air White' },
    { name: 'Monitor', description: '34" 1440P 144Hz Ultrawide' }
  ];

  const laptopSetup = [
    { name: 'Model', description: 'Asus ROG Strix G15' },
    { name: 'CPU', description: 'AMD Ryzen 7 4800H' },
    { name: 'GPU', description: 'NVIDIA GeForce RTX 3060 Mobile' },
    { name: 'RAM', description: '16 GB DDR4 3600MHz' },
    { name: 'Storage', description: '1TB NVMe SSD + 120GB NVMe SSD' }
  ];

  const laptopSetup2 = [
    { name: 'Model', description: 'Macbook Air 2022' },
    { name: 'CPU/GPU', description: 'Apple M2' },
    { name: 'RAM', description: '16 GB Unified Memory' },
    { name: 'Storage', description: '512GB SSD' }
  ];

  const serverSetup = [
    { name: 'CPU', description: 'AMD Ryzen 7 5700G' },
    { name: 'RAM', description: '48GB DDR4 3600MHz' },
    { name: 'Storage', description: '1TB NVMe SSD + 4TB HDD' },
    { name: 'OS', description: 'Ubuntu Server 24.04.2 LTS' }
  ];

  const cameraSetup = [
    { name: 'Body', description: 'Canon EOS R7' },
    { name: 'Primary Lens', description: 'EF-S 18-135mm f/3.5-5.6 Nano USM' },
    { name: 'Portrait Lens', description: 'RF 50mm f/1.8 STM' },
    { name: 'Telephoto', description: 'EF-S 55-250mm f/4-5.6 IS STM' }
  ];

  return (
    <DefaultLayout
      title="About Me"
      subtitle="Developer, Content Creator, Gamer"
      backgroundImage="/assets/spoekleMe.webp"
    >
      {/* Bio Section */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl overflow-hidden shadow-lg mb-12">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-purple-500 pb-2"
                variants={fadeIn}
              >
                Who I Am
              </motion.h2>

              <motion.div className="prose prose-lg dark:prose-invert max-w-none" variants={fadeIn}>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  Hi there! I'm Spoekle, a passionate developer, content creator, photographer and gamer from the Netherlands. I've been building web applications and creating content for several years, with a focus on modern web technologies and gaming experiences.
                </p>

                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  My journey in tech began with simple website development, which quickly evolved into a deep passion for creating interactive web applications using modern frameworks like React and Node.js. I'm particularly interested in building applications that automate workflows or make them faster, whether it's for my own benefit, or for others.
                </p>

                <p className="text-neutral-700 dark:text-gray-300">
                  When I'm not coding, you'll likely find me creating content for TikTok, outside taking pictures, or diving into the latest multiplayer horror games. I'm especially passionate about Beat Saber and Minecraft, where I've built communities and created custom content.
                </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl shadow-lg mb-12">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-indigo-500 pb-2"
                variants={fadeIn}
              >
                What I Do
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                variants={skillCardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center mb-4 text-white text-3xl">
                  <FaCode />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Web Development</h3>
                <p className="text-neutral-700 dark:text-gray-300">
                  I build modern web applications using React, TypeScript, and Node.js. My focus is on creating responsive, accessible, and performant experiences that users love.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                variants={skillCardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center mb-4 text-white text-3xl">
                  <FaTiktok />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Content Creation</h3>
                <p className="text-neutral-700 dark:text-gray-300">
                  I record videos and post them on TikTok, although they are in Dutch, they stick quite well!
                </p>
              </motion.div>

              <motion.div
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                variants={skillCardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center mb-4 text-white text-3xl">
                  <FaGamepad />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Gaming</h3>
                <p className="text-neutral-700 dark:text-gray-300">
                  I'm a gamer with a particular focus on Beat Saber and Minecraft. I create custom maps, servers and more for these games and others.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50"
                variants={skillCardVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-14 h-14 bg-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white text-3xl">
                  <FaServer />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">Homeserver</h3>
                <p className="text-neutral-700 dark:text-gray-300">
                  I host my own homeserver for various applications, including game servers, media servers, and more. I enjoy the challenge of setting up and maintaining my own infrastructure.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-900/50 rounded-xl shadow-lg">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-cyan-500 pb-2"
                variants={fadeIn}
              >
                Skills
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50 flex flex-col items-center text-center"
                    variants={skillCardVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className={`text-4xl mb-3 ${skill.color}`}>
                      {skill.icon}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">{skill.name}</h3>
                  </motion.div>
                ))}
            </div>

            <motion.h2
              className="mt-4 text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-cyan-500 pb-2"
              variants={fadeIn}
            >
              Languages
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {languages.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50 flex flex-col items-center text-center"
                    variants={skillCardVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className={`text-4xl mb-3 ${skill.color}`}>
                      {skill.icon}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">{skill.name}</h3>
                  </motion.div>
                ))}
            </div>

            <motion.h2
              className="mt-4 text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-cyan-500 pb-2"
              variants={fadeIn}
            >
              Frameworks I use
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {frameworks.map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50 flex flex-col items-center text-center"
                    variants={skillCardVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className={`text-4xl mb-3 ${skill.color}`}>
                      {skill.icon}
                    </div>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white">{skill.name}</h3>
                  </motion.div>
                ))}
            </div>

            <motion.p
              className="text-neutral-700 dark:text-gray-300 mt-12 text-center"
              variants={fadeIn}
            >
              And many more! I'm always exploring new technologies and expanding my skillset.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* My Gear Section */}
      <section className="py-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl shadow-lg mt-12">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            {...useAlwaysInView}
            variants={staggerContainer}
          >
              <motion.h2
                className="text-3xl font-bold text-neutral-800 dark:text-white mb-8 inline-block border-b-4 border-blue-500 pb-2"
                variants={fadeIn}
              >
                My Gear
            </motion.h2>

            {/* PC Setup */}
            <motion.div
              className="mb-10"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                  <FaDesktop />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">PC Setup</h3>
              </div>
              <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pcSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Laptop Setup */}
            <motion.div
              className="mb-10"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                  <FaLaptopCode />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Laptop Setup</h3>
              </div>
              <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laptopSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Laptop Setup 2 */}
            <motion.div
              className="mb-10"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                  <FaLaptopCode />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Laptop Setup 2</h3>
              </div>
              <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laptopSetup2.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Server Setup */}
            <motion.div
              className="mb-10"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                  <FaServer />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Server Setup</h3>
              </div>
              <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serverSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Camera Setup */}
            <motion.div
              className="mb-10"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl mr-3">
                  <FaCamera />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Camera Setup</h3>
              </div>
              <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cameraSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-semibold text-neutral-800 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-700 dark:text-gray-300">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
}
