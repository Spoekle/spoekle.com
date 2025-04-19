// filepath: /data/compose/spoekle.com/frontend/src/pages/Portfolio/IconSelector.tsx
import React from 'react';
import { 
  SiReact, SiNodedotjs, SiTypescript, SiTailwindcss, SiJavascript, 
  SiHtml5, SiCss3, SiNextdotjs, SiExpress, SiMongodb, SiFirebase, 
  SiPython, SiDjango, SiFlask, SiVuedotjs, SiAngular, 
  SiDocker, SiGithub, SiGitlab, SiAmazon,
  SiPhp, SiLaravel, SiWordpress, SiDotnet, SiSpring,
  SiRedis, SiPostgresql, SiMysql, SiGraphql, SiElasticsearch,
  SiRust, SiGo, SiUnity, SiAndroid, SiSwift as SiIos
} from 'react-icons/si';
import { FaCheck } from 'react-icons/fa';

interface IconSelectorProps {
  selectedTechs: string[];
  onSelectTech: (tech: string) => void;
}

interface TechIcon {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedTechs, onSelectTech }) => {
  // Define available tech icons with their display name, icon component, and color
  const techIcons: TechIcon[] = [
    { name: 'react', icon: <SiReact />, color: 'text-blue-500' },
    { name: 'nodejs', icon: <SiNodedotjs />, color: 'text-green-600' },
    { name: 'typescript', icon: <SiTypescript />, color: 'text-blue-600' },
    { name: 'javascript', icon: <SiJavascript />, color: 'text-yellow-500' },
    { name: 'html', icon: <SiHtml5 />, color: 'text-orange-600' },
    { name: 'css', icon: <SiCss3 />, color: 'text-blue-500' },
    { name: 'tailwindcss', icon: <SiTailwindcss />, color: 'text-cyan-400' },
    { name: 'nextjs', icon: <SiNextdotjs />, color: 'text-black dark:text-white' },
    { name: 'express', icon: <SiExpress />, color: 'text-gray-600 dark:text-gray-400' },
    { name: 'mongodb', icon: <SiMongodb />, color: 'text-green-500' },
    { name: 'firebase', icon: <SiFirebase />, color: 'text-yellow-600' },
    { name: 'python', icon: <SiPython />, color: 'text-blue-500' },
    { name: 'django', icon: <SiDjango />, color: 'text-green-800' },
    { name: 'flask', icon: <SiFlask />, color: 'text-black dark:text-white' },
    { name: 'vue', icon: <SiVuedotjs />, color: 'text-emerald-500' },
    { name: 'angular', icon: <SiAngular />, color: 'text-red-600' },
    { name: 'docker', icon: <SiDocker />, color: 'text-blue-600' },
    { name: 'github', icon: <SiGithub />, color: 'text-black dark:text-white' },
    { name: 'gitlab', icon: <SiGitlab />, color: 'text-orange-600' },
    { name: 'aws', icon: <SiAmazon />, color: 'text-orange-500' },
    { name: 'php', icon: <SiPhp />, color: 'text-indigo-600' },
    { name: 'laravel', icon: <SiLaravel />, color: 'text-red-600' },
    { name: 'wordpress', icon: <SiWordpress />, color: 'text-blue-700' },
    { name: 'dotnet', icon: <SiDotnet />, color: 'text-purple-600' },
    { name: 'spring', icon: <SiSpring />, color: 'text-green-600' },
    { name: 'redis', icon: <SiRedis />, color: 'text-red-600' },
    { name: 'postgresql', icon: <SiPostgresql />, color: 'text-blue-600' },
    { name: 'mysql', icon: <SiMysql />, color: 'text-blue-500' },
    { name: 'graphql', icon: <SiGraphql />, color: 'text-pink-600' },
    { name: 'elasticsearch', icon: <SiElasticsearch />, color: 'text-green-500' },
    { name: 'rust', icon: <SiRust />, color: 'text-orange-700' },
    { name: 'go', icon: <SiGo />, color: 'text-blue-500' },
    { name: 'unity', icon: <SiUnity />, color: 'text-gray-800 dark:text-gray-200' },
    { name: 'android', icon: <SiAndroid />, color: 'text-green-600' },
    { name: 'ios', icon: <SiIos />, color: 'text-gray-900 dark:text-gray-100' },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Select Technology Icons
      </h3>
      <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {techIcons.map((tech) => {
            const isSelected = selectedTechs.includes(tech.name);
            return (
              <button
                key={tech.name}
                type="button"
                onClick={() => onSelectTech(tech.name)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-500 dark:border-indigo-400' 
                    : 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className={`text-2xl ${tech.color} relative`}>
                  {tech.icon}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                      <FaCheck className="text-[10px]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                  {tech.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
