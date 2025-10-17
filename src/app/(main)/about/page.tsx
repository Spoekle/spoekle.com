'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaCode, FaDesktop } from 'react-icons/fa';
import DefaultLayout from '@/components/DefaultLayout';
import Me from './components/Me';
import Skills from './components/Skills';
import Specs from './components/Specs';

type TabType = 'me' | 'skills' | 'specs';

export default function AboutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('me');

  // Initialize tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['me', 'skills', 'specs'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  return (
    <DefaultLayout
      title="About Me"
      subtitle="Developer, Content Creator, Gamer"
      backgroundImage="/assets/spoekleMe.webp"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-12">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3 bg-black/10 dark:bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-black/20 dark:border-white/20"
        >
          <button
            onClick={() => handleTabChange('me')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'me'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <FaUser />
            <span>About Me</span>
          </button>
          <button
            onClick={() => handleTabChange('skills')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'skills'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <FaCode />
            <span>Skills</span>
          </button>
          <button
            onClick={() => handleTabChange('specs')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'specs'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <FaDesktop />
            <span>My Gear</span>
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'me' && <Me />}
          {activeTab === 'skills' && <Skills />}
          {activeTab === 'specs' && <Specs />}
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
