'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import DefaultLayout from '@/components/DefaultLayout';
import { useAuth } from '@/context/AuthContext';
import { cookieUtils } from '@/lib/cookies';

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export default function PortfolioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/portfolio');
      const data = response.data.data || response.data;
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = cookieUtils.get('token');
      await axios.delete(`/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const isAdmin = user?.roles?.includes('admin');

  return (
    <DefaultLayout
      title="Portfolio"
      subtitle="A showcase of my work and projects"
      backgroundImage="/assets/slider/slider3.jpg"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                  : 'bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-white hover:border-neutral-300 dark:hover:border-white/20 shadow-lg dark:shadow-none'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/portfolio/new')}
              className="flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
            >
              <FaEdit />
              <span>Add New Project</span>
            </motion.button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-16 h-16 border-4 border-neutral-900 dark:border-white rounded-full border-t-transparent"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              No projects found
            </h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {selectedCategory === 'all' 
                ? 'Check back later for new projects!' 
                : `No projects in the "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
              >
                {project.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                )}

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {project.title}
                    </h3>
                    <span className="px-3 py-1 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-white">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300 text-sm"
                      >
                        <FaExternalLinkAlt />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm"
                      >
                        <FaGithub />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={() => router.push(`/portfolio/edit/${project._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-all duration-300 text-sm"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-800/30 transition-all duration-300 text-sm"
                      >
                        <FaTrash />
                        <span>Delete</span>
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
}
