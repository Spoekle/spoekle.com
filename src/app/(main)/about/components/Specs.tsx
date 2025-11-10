'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDesktop, FaLaptopCode, FaServer, FaCamera } from 'react-icons/fa';
import Image from 'next/image';

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

const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

export default function Specs() {
  const setupImages = {
    mainSetup: '',
    laptop1: '',
    laptop2: '',
    server: '',
    camera: '',
  };

  const mainSetup = [
    { name: 'CPU', description: 'AMD Ryzen 7 7800X3D' },
    { name: 'GPU', description: 'Gigabyte AERO NVIDIA GeForce RTX 5080' },
    { name: 'Mobo', description: 'Gigabyte B650E AORUS ELITE X AX ICE' },
    { name: 'PSU', description: 'be quiet! Pure Power 11 850W' },
    { name: 'Cooling', description: 'Cooler Master ML240L V2 RGB White' },
    { name: 'RAM', description: '32GB DDR5 6000MHz' },
    { name: 'Storage', description: '2TB NVMe SSD + 1TB NVMe SSD' },
    { name: 'Case', description: 'Fractal Design Pop Air White' },
    { name: 'Monitor', description: '34" 1440P 144Hz Ultrawide' },
    { name: 'Info', description: 'Banger picture I know..' },
  ];

  const laptopSetup = [
    { name: 'Model', description: 'Asus ROG Strix G15' },
    { name: 'CPU', description: 'AMD Ryzen 7 4800H' },
    { name: 'GPU', description: 'NVIDIA GeForce RTX 3060 Mobile' },
    { name: 'RAM', description: '16 GB DDR4 3600MHz' },
    { name: 'Storage', description: '1TB NVMe SSD + 120GB NVMe SSD' }
  ];

  const laptop2Setup = [
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
              My Gear
          </motion.h2>

          {/* PC Setup */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                <FaDesktop />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Main Setup</h3>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                    </div>
                  ))}
                </div>
                {setupImages.mainSetup && (
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={setupImages.mainSetup}
                        alt="Main Setup"
                        width={256}
                        height={192}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Laptop Setup */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                <FaLaptopCode />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Laptop #1</h3>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laptopSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                    </div>
                  ))}
                </div>
                {setupImages.laptop1 && (
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={setupImages.laptop1}
                        alt="Laptop #1"
                        width={256}
                        height={192}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Laptop Setup 2 */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                <FaLaptopCode />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Laptop #2</h3>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laptop2Setup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                    </div>
                  ))}
                </div>
                {setupImages.laptop2 && (
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={setupImages.laptop2}
                        alt="Laptop #2"
                        width={256}
                        height={192}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Server Setup */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                <FaServer />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Server Setup</h3>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serverSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                    </div>
                  ))}
                </div>
                {setupImages.server && (
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={setupImages.server}
                        alt="Server Setup"
                        width={256}
                        height={192}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Camera Setup */}
          <motion.div
            className="mb-12"
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                <FaCamera />
              </div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">Camera Setup</h3>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cameraSetup.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold text-neutral-900 dark:text-white min-w-[100px]">{item.name}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{item.description}</span>
                    </div>
                  ))}
                </div>
                {setupImages.camera && (
                  <div className="flex-shrink-0">
                    <div className="w-full md:w-64 rounded-lg overflow-hidden">
                      <Image
                        src={setupImages.camera}
                        alt="Camera Setup"
                        width={256}
                        height={192}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
