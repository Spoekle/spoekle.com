// filepath: /data/compose/spoekle.com/frontend/src/pages/Portfolio/components/TechIcons.tsx
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

interface TechIconsProps {
  techs: string[];
  size?: "sm" | "md" | "lg";
}

// Utility function to map tech name to its icon component
const getTechIcon = (techName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    react: <SiReact />,
    nodejs: <SiNodedotjs />,
    typescript: <SiTypescript />,
    javascript: <SiJavascript />,
    html: <SiHtml5 />,
    css: <SiCss3 />,
    tailwindcss: <SiTailwindcss />,
    nextjs: <SiNextdotjs />,
    express: <SiExpress />,
    mongodb: <SiMongodb />,
    firebase: <SiFirebase />,
    python: <SiPython />,
    django: <SiDjango />,
    flask: <SiFlask />,
    vue: <SiVuedotjs />,
    angular: <SiAngular />,
    docker: <SiDocker />,
    github: <SiGithub />,
    gitlab: <SiGitlab />,
    aws: <SiAmazon />,
    php: <SiPhp />,
    laravel: <SiLaravel />,
    wordpress: <SiWordpress />,
    dotnet: <SiDotnet />,
    spring: <SiSpring />,
    redis: <SiRedis />,
    postgresql: <SiPostgresql />,
    mysql: <SiMysql />,
    graphql: <SiGraphql />,
    elasticsearch: <SiElasticsearch />,
    rust: <SiRust />,
    go: <SiGo />,
    unity: <SiUnity />,
    android: <SiAndroid />,
    ios: <SiIos />
  };

  return iconMap[techName] || null;
};

// Utility function to get the appropriate color for each tech
const getTechColor = (techName: string) => {
  const colorMap: Record<string, string> = {
    react: 'text-blue-500',
    nodejs: 'text-green-600',
    typescript: 'text-blue-600',
    javascript: 'text-yellow-500',
    html: 'text-orange-600',
    css: 'text-blue-500',
    tailwindcss: 'text-cyan-400',
    nextjs: 'text-black dark:text-white',
    express: 'text-gray-600 dark:text-gray-400',
    mongodb: 'text-green-500',
    firebase: 'text-yellow-600',
    python: 'text-blue-500',
    django: 'text-green-800',
    flask: 'text-black dark:text-white',
    vue: 'text-emerald-500',
    angular: 'text-red-600',
    docker: 'text-blue-600',
    github: 'text-black dark:text-white',
    gitlab: 'text-orange-600',
    aws: 'text-orange-500',
    php: 'text-indigo-600',
    laravel: 'text-red-600',
    wordpress: 'text-blue-700',
    dotnet: 'text-purple-600',
    spring: 'text-green-600',
    redis: 'text-red-600',
    postgresql: 'text-blue-600',
    mysql: 'text-blue-500',
    graphql: 'text-pink-600',
    elasticsearch: 'text-green-500',
    rust: 'text-orange-700',
    go: 'text-blue-500',
    unity: 'text-gray-800 dark:text-gray-200',
    android: 'text-green-600',
    ios: 'text-gray-900 dark:text-gray-100'
  };

  return colorMap[techName] || 'text-gray-600 dark:text-gray-300';
};

const TechIcons: React.FC<TechIconsProps> = ({ techs, size = "md" }) => {
  // Size class mappings
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex flex-wrap gap-2">
      {techs && techs.map((tech, index) => {
        const icon = getTechIcon(tech);
        if (!icon) return null;

        return (
          <div 
            key={index} 
            className="flex items-center justify-center tooltip"
            title={tech.charAt(0).toUpperCase() + tech.slice(1)}
          >
            <span className={`${sizeClasses[size]} ${getTechColor(tech)} hover:scale-110 transition-transform`}>
              {icon}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TechIcons;
