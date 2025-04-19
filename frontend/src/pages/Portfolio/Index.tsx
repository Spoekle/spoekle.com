// filepath: /data/compose/spoekle.com/frontend/src/pages/Portfolio/Index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaExternalLinkAlt, FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useNotification } from '../../context/NotificationContext';
import TechIcons from './components/TechIcons';

// Import portfolio background image
import portfolioBackground from '../../assets/coding.webp';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  link: string;
  github: string;
  techs: string[];
  category: string;
  featured: boolean;
  order?: number;
}

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categories] = useState<string[]>([
    'All Projects', 
    'Web Development', 
    'Applications', 
    'Open Source'
  ]);

  // Check if user is admin
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.roles && userData.roles.includes('admin'));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = '/api/portfolio';
      
      if (selectedCategory !== 'All Projects') {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showError('Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleCreateProject = () => {
    navigate('/portfolio/new');
  };

  return (
    <DefaultLayout
      title="Portfolio"
      subtitle="Projects & Development Work"
      backgroundImage={portfolioBackground}
      metaDescription="Spoekle's development portfolio - Web applications, software projects, and coding work"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaCode className="text-4xl text-indigo-600 dark:text-indigo-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  My Development Projects
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Web applications, software, and other coding endeavors
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateProject}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Add Project</span>
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Project filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${
                selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-white hover:bg-white/90 dark:hover:bg-neutral-600/90'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-3xl text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              No projects found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {selectedCategory !== 'All Projects'
                ? `No projects in the ${selectedCategory} category.`
                : "No portfolio projects have been added yet."}
            </p>
            {isAdmin && (
              <button
                onClick={handleCreateProject}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white/70 dark:bg-neutral-700/70 rounded-xl overflow-hidden shadow-lg border border-white/20 dark:border-neutral-600/50"
              >
                <div className="h-52 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center relative overflow-clip">
                  {project.image ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <motion.img 
                        src={project.image} 
                        alt={project.title} 
                        title='Click to view project'
                        className="w-full h-full object-cover hover:cursor-pointer" 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <FaCode className="text-5xl mb-3 text-white/80" />
                      <p className="text-neutral-800 dark:text-neutral-200 font-medium text-center px-4">
                        Project Preview
                      </p>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <FaExternalLinkAlt size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-300 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Tech Icons */}
                  {project.techs && project.techs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-600/50">
                      <TechIcons techs={project.techs} size="md" />
                    </div>
                  )}
                  
                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600/50">
                      <button
                        onClick={() => navigate(`/portfolio/edit/${project._id}`)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                      >
                        Edit Project
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default PortfolioPage;
