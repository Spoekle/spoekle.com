'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SiReact, SiNodedotjs, SiMongodb, SiJavascript, SiMysql, SiSharp, SiPython, SiUnity, SiBlender, SiTailwindcss, SiExpress, SiAdobepremierepro, SiAdobelightroom, SiAdobephotoshop, SiTypescript, SiNextdotjs, SiGodotengine, SiGithub, SiGit, SiSvelte, SiElectron } from 'react-icons/si';
import { BiLoaderCircle } from 'react-icons/bi';

interface LanguageStat {
  language: string;
  bytes: number;
  percentage: string;
  color: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.1 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const skillCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
  }
};

const useAlwaysInView = {
  initial: "hidden",
  animate: "visible", 
  whileInView: "visible",
  viewport: { once: true, amount: 0.1 }
};

export default function Skills() {
  const [githubLanguages, setGithubLanguages] = useState<LanguageStat[]>([]);
  const [loadingGithub, setLoadingGithub] = useState(true);

  useEffect(() => {
    fetchGithubLanguages();
  }, []);

  const fetchGithubLanguages = async () => {
    try {
      const response = await fetch('/api/github/languages');
      const data = await response.json();
      if (data.success) {
        setGithubLanguages(data.data);
      }
    } catch (error) {
      console.error('Error fetching GitHub languages:', error);
    } finally {
      setLoadingGithub(false);
    }
  };

  const skills = [
    { icon: <SiBlender />, name: 'Blender', color: 'text-orange-400' },
    { icon: <SiUnity />, name: 'Unity', color: 'text-gray-400' },
    { icon: <SiGodotengine />, name: 'Godot', color: 'text-blue-600' },
    { icon: <SiAdobepremierepro />, name: 'Premiere Pro', color: 'text-indigo-700' },
    { icon: <SiAdobelightroom />, name: 'Lightroom', color: 'text-blue-400' },
    { icon: <SiAdobephotoshop />, name: 'Photoshop', color: 'text-blue-600' },
    { icon: <SiGit />, name: 'Git', color: 'text-orange-600' },
  ];

  const languages = [
    { icon: <SiTypescript />, name: 'TypeScript', color: 'text-blue-600' },
    { icon: <SiJavascript />, name: 'JavaScript', color: 'text-yellow-400' },
    { icon: <SiMysql />, name: 'SQL', color: 'text-green-600' },
    { icon: <SiSharp />, name: 'C#', color: 'text-purple-600' },
    { icon: <SiPython />, name: 'Python', color: 'text-yellow-500' },
  ];

  const frameworks = [
    { icon: <SiReact />, name: 'React', color: 'text-blue-400' },
    { icon: <SiNextdotjs />, name: 'Next.js', color: 'text-black dark:text-white' },
    { icon: <SiTailwindcss />, name: 'TailwindCSS', color: 'text-cyan-500' },
    { icon: <SiExpress />, name: 'Express', color: 'dark:text-white text-neutral-800' },
    { icon: <SiElectron />, name: 'Electron', color: 'text-cyan-500' },
    { icon: <SiNodedotjs />, name: 'Node.js', color: 'text-green-600' },
    { icon: <SiMongodb />, name: 'MongoDB', color: 'text-green-500' },
    { icon: <SiSvelte />, name: 'Svelte', color: 'text-orange-500' },
  ];

  return (
    <section className="py-32 bg-neutral-200/40 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl">
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
              Skills
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-6 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none flex flex-col items-center text-center"
                  variants={skillCardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className={`text-4xl mb-3 ${skill.color}`}>
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{skill.name}</h3>
                </motion.div>
              ))}
          </div>

          <motion.h2
            className="mt-20 text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
            variants={fadeIn}
          >
            Languages
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {languages.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-6 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none flex flex-col items-center text-center"
                  variants={skillCardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className={`text-4xl mb-3 ${skill.color}`}>
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{skill.name}</h3>
                </motion.div>
              ))}
          </div>

          <motion.h2
            className="mt-20 text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
            variants={fadeIn}
          >
            Frameworks
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {frameworks.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-6 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none flex flex-col items-center text-center"
                  variants={skillCardVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className={`text-4xl mb-3 ${skill.color}`}>
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{skill.name}</h3>
                </motion.div>
              ))}
          </div>

          <motion.p
            className="text-neutral-600 dark:text-neutral-400 mt-16 text-center text-lg"
            variants={fadeIn}
          >
            And many more! I'm always exploring new technologies and expanding my skillset.
          </motion.p>

          {/* GitHub Language Statistics */}
          <motion.h2
            className="mt-20 text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-12"
            variants={fadeIn}
          >
            GitHub Language Stats
          </motion.h2>

          {loadingGithub ? (
            <div className="flex justify-center items-center py-12">
              <BiLoaderCircle className="animate-spin text-5xl text-neutral-900 dark:text-white" />
            </div>
          ) : githubLanguages.length > 0 ? (
            <motion.div
              className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg dark:shadow-none"
              variants={fadeIn}
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 text-center">
                <SiGithub className="inline-block mr-2 mb-1" />
                Language distribution across all my GitHub repositories
              </p>
              
              {/* Language bars */}
              <div className="space-y-4">
                {githubLanguages.map((lang, index) => (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {lang.language}
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {lang.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: lang.color,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-8 border-t border-neutral-300 dark:border-neutral-600">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {githubLanguages.slice(0, 10).map((lang) => (
                    <div key={lang.language} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: lang.color,
                        }}
                      />
                      <span className="text-xs text-neutral-700 dark:text-neutral-300">
                        {lang.language}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl p-8 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg dark:shadow-none text-center"
              variants={fadeIn}
            >
              <p className="text-neutral-600 dark:text-neutral-400">
                Unable to load GitHub language statistics at this time.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
