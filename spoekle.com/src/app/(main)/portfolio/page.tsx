'use client';'use client';'use client';



import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';import { useEffect, useState } from 'react';import React, { useEffect, useState } from 'react';

import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';

import axios from 'axios';import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation';

import DefaultLayout from '@/components/DefaultLayout';

import { useAuth } from '@/context/AuthContext';import { motion } from 'framer-motion';import { motion } from 'framer-motion';



interface PortfolioProject {import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';import { FaGithub, FaExternalLinkAlt, FaCode, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

  _id: string;

  title: string;import axios from 'axios';import axios from 'axios';

  description: string;

  technologies: string[];import DefaultLayout from '@/components/DefaultLayout';import Image from 'next/image';

  imageUrl?: string;

  liveUrl?: string;import { useAuth } from '@/context/AuthContext';import DefaultLayout from '@/components/DefaultLayout';

  githubUrl?: string;

  category: string;import { useAuth } from '@/context/AuthContext';

  featured: boolean;

  createdAt: string;interface PortfolioProject {

}

  _id: string;interface PortfolioProject {

export default function PortfolioPage() {

  const router = useRouter();  title: string;  _id: string;

  const { user } = useAuth();

  const [projects, setProjects] = useState<PortfolioProject[]>([]);  description: string;  title: string;

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');  technologies: string[];  description: string;



  useEffect(() => {  imageUrl?: string;  longDescription: string;

    fetchProjects();

  }, []);  liveUrl?: string;  technologies: string[];



  const fetchProjects = async () => {  githubUrl?: string;  category: string;

    try {

      setLoading(true);  category: string;  imageUrl?: string;

      const response = await axios.get('/api/portfolio');

      const data = response.data.data || response.data;  featured: boolean;  githubUrl?: string;

      setProjects(data);

    } catch (error) {  createdAt: string;  liveUrl?: string;

      console.error('Error fetching projects:', error);

    } finally {}  featured: boolean;

      setLoading(false);

    }  order: number;

  };

export default function PortfolioPage() {  createdAt: string;

  const handleDelete = async (id: string) => {

    if (!confirm('Are you sure you want to delete this project?')) {  const router = useRouter();}

      return;

    }  const { user } = useAuth();



    try {  const [projects, setProjects] = useState<PortfolioProject[]>([]);const categories = ['All Projects', 'Web Development', 'Applications', 'Open Source'];

      const token = localStorage.getItem('token');

      await axios.delete(`/api/portfolio/${id}`, {  const [loading, setLoading] = useState(true);

        headers: { Authorization: `Bearer ${token}` },

      });  const [selectedCategory, setSelectedCategory] = useState<string>('all');export default function PortfolioPage() {

      fetchProjects();

    } catch (error) {  const router = useRouter();

      console.error('Error deleting project:', error);

      alert('Failed to delete project');  useEffect(() => {  const { user } = useAuth();

    }

  };    fetchProjects();  const [projects, setProjects] = useState<PortfolioProject[]>([]);



  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];  }, []);  const [loading, setLoading] = useState(true);

  const filteredProjects = selectedCategory === 'all' 

    ? projects   const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');

    : projects.filter(p => p.category === selectedCategory);

  const fetchProjects = async () => {  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const isAdmin = user?.roles?.includes('admin');

    try {

  return (

    <DefaultLayout      setLoading(true);  useEffect(() => {

      title="Portfolio"

      subtitle="A showcase of my work and projects"      const response = await axios.get('/api/portfolio');    setIsAdmin(user?.roles?.includes('admin') || false);

      backgroundImage="/assets/slider/slider3.jpg"

    >      const data = response.data.data || response.data;  }, [user]);

      <div className="container mx-auto px-4 py-8">

        {/* Category Filter */}      setProjects(data);

        <div className="flex flex-wrap gap-3 justify-center mb-8">

          {categories.map((category) => (    } catch (error) {  useEffect(() => {

            <button

              key={category}      console.error('Error fetching projects:', error);    fetchProjects();

              onClick={() => setSelectedCategory(category)}

              className={`px-4 py-2 rounded-lg font-medium transition-colors ${    } finally {  }, [selectedCategory]);

                selectedCategory === category

                  ? 'bg-indigo-600 text-white'      setLoading(false);

                  : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-neutral-700'

              }`}    }  const fetchProjects = async () => {

            >

              {category.charAt(0).toUpperCase() + category.slice(1)}  };    try {

            </button>

          ))}      setLoading(true);

        </div>

  const handleDelete = async (id: string) => {      let url = '/api/portfolio';

        {/* Admin Controls */}

        {isAdmin && (    if (!confirm('Are you sure you want to delete this project?')) {      

          <div className="flex justify-end mb-6">

            <motion.button      return;      if (selectedCategory !== 'All Projects') {

              whileHover={{ scale: 1.05 }}

              whileTap={{ scale: 0.98 }}    }        url += `?category=${encodeURIComponent(selectedCategory)}`;

              onClick={() => router.push('/admin/portfolio/new')}

              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"      }

            >

              <FaEdit />    try {      

              <span>Add New Project</span>

            </motion.button>      const token = localStorage.getItem('token');      const response = await axios.get(url);

          </div>

        )}      await axios.delete(`/api/portfolio/${id}`, {      // API responses are wrapped in { success: true, data: [...] }



        {/* Projects Grid */}        headers: { Authorization: `Bearer ${token}` },      setProjects(response.data.data || response.data);

        {loading ? (

          <div className="flex justify-center items-center h-64">      });    } catch (error) {

            <div className="animate-spin w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"></div>

          </div>      fetchProjects();      console.error('Error fetching portfolio projects:', error);

        ) : filteredProjects.length === 0 ? (

          <div className="text-center py-20">    } catch (error) {    } finally {

            <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-4">

              No projects found      console.error('Error deleting project:', error);      setLoading(false);

            </h3>

            <p className="text-neutral-600 dark:text-neutral-400">      alert('Failed to delete project');    }

              {selectedCategory === 'all' 

                ? 'Check back later for new projects!'     }  };

                : `No projects in the "${selectedCategory}" category.`}

            </p>  };

          </div>

        ) : (  const handleDeleteProject = async (projectId: string) => {

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProjects.map((project, index) => (  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];    if (!confirm('Are you sure you want to delete this project?')) {

              <motion.div

                key={project._id}  const filteredProjects = selectedCategory === 'all'       return;

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}    ? projects     }

                transition={{ duration: 0.5, delay: index * 0.1 }}

                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-white/20 dark:border-neutral-700/50"    : projects.filter(p => p.category === selectedCategory);

              >

                {/* Project Image */}    try {

                {project.imageUrl && (

                  <div className="relative h-48 overflow-hidden">  const isAdmin = user?.roles?.includes('admin');      const token = localStorage.getItem('token');

                    <img

                      src={project.imageUrl}      await axios.delete(`/api/portfolio/${projectId}`, {

                      alt={project.title}

                      className="w-full h-full object-cover"  return (        headers: { Authorization: `Bearer ${token}` },

                    />

                    {project.featured && (    <DefaultLayout      });

                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">

                        Featured      title="Portfolio"      

                      </div>

                    )}      subtitle="A showcase of my work and projects"      // Refresh projects list

                  </div>

                )}      backgroundImage="/assets/slider/slider3.jpg"      fetchProjects();



                {/* Project Content */}    >    } catch (error) {

                <div className="p-6">

                  <div className="flex justify-between items-start mb-3">      <div className="container mx-auto px-4 py-8">      console.error('Error deleting project:', error);

                    <h3 className="text-xl font-bold text-neutral-800 dark:text-white">

                      {project.title}        {/* Category Filter */}      alert('Failed to delete project');

                    </h3>

                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">        <div className="flex flex-wrap gap-3 justify-center mb-8">    }

                      {project.category}

                    </span>          {categories.map((category) => (  };

                  </div>

            <button

                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">

                    {project.description}              key={category}  return (

                  </p>

              onClick={() => setSelectedCategory(category)}    <DefaultLayout

                  {/* Technologies */}

                  <div className="flex flex-wrap gap-2 mb-4">              className={`px-4 py-2 rounded-lg font-medium transition-colors ${      title="Portfolio"

                    {project.technologies.map((tech, idx) => (

                      <span                selectedCategory === category      subtitle="Projects & Development Work"

                        key={idx}

                        className="px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"                  ? 'bg-indigo-600 text-white'      backgroundImage="/assets/coding.webp"

                      >

                        {tech}                  : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-neutral-700'    >

                      </span>

                    ))}              }`}      {/* Header Section */}

                  </div>

            >      <motion.div

                  {/* Links */}

                  <div className="flex gap-3">              {category.charAt(0).toUpperCase() + category.slice(1)}        initial={{ opacity: 0, y: 20 }}

                    {project.liveUrl && (

                      <a            </button>        animate={{ opacity: 1, y: 0 }}

                        href={project.liveUrl}

                        target="_blank"          ))}        transition={{ duration: 0.5 }}

                        rel="noopener noreferrer"

                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"        </div>        className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 mb-8"

                      >

                        <FaExternalLinkAlt />      >

                        <span>Live Demo</span>

                      </a>        {/* Admin Controls */}        <div className="flex items-center justify-between">

                    )}

                    {project.githubUrl && (        {isAdmin && (          <div className="flex items-center">

                      <a

                        href={project.githubUrl}          <div className="flex justify-end mb-6">            <FaCode className="text-4xl text-indigo-600 dark:text-indigo-400 mr-4" />

                        target="_blank"

                        rel="noopener noreferrer"            <motion.button            <div>

                        className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"

                      >              whileHover={{ scale: 1.05 }}              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">

                        <FaGithub />

                        <span>Code</span>              whileTap={{ scale: 0.98 }}                My Development Projects

                      </a>

                    )}              onClick={() => router.push('/admin/portfolio/new')}              </h2>

                  </div>

              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"              <p className="text-neutral-600 dark:text-neutral-400">

                  {/* Admin Controls */}

                  {isAdmin && (            >                Web applications, software, and other coding endeavors

                    <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">

                      <button              <FaEdit />              </p>

                        onClick={() => router.push(`/admin/portfolio/edit/${project._id}`)}

                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors text-sm"              <span>Add New Project</span>            </div>

                      >

                        <FaEdit />            </motion.button>          </div>

                        <span>Edit</span>

                      </button>          </div>          {isAdmin && (

                      <button

                        onClick={() => handleDelete(project._id)}        )}            <motion.button

                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors text-sm"

                      >              whileHover={{ scale: 1.05 }}

                        <FaTrash />

                        <span>Delete</span>        {/* Projects Grid */}              whileTap={{ scale: 0.98 }}

                      </button>

                    </div>        {loading ? (              onClick={() => router.push('/admin/portfolio/new')}

                  )}

                </div>          <div className="flex justify-center items-center h-64">              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"

              </motion.div>

            ))}            <div className="animate-spin w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"></div>            >

          </div>

        )}          </div>              <FaPlus />

      </div>

    </DefaultLayout>        ) : filteredProjects.length === 0 ? (              <span>New Project</span>

  );

}          <div className="text-center py-20">            </motion.button>


            <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-4">          )}

              No projects found        </div>

            </h3>      </motion.div>

            <p className="text-neutral-600 dark:text-neutral-400">

              {selectedCategory === 'all'       {/* Category Filter */}

                ? 'Check back later for new projects!'       <div className="flex flex-wrap justify-center gap-3 mb-12">

                : `No projects in the "${selectedCategory}" category.`}        {categories.map((category) => (

            </p>          <button

          </div>            key={category}

        ) : (            onClick={() => setSelectedCategory(category)}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            className={`px-6 py-2 rounded-full font-medium transition-all shadow-md ${

            {filteredProjects.map((project, index) => (              category === selectedCategory

              <motion.div                ? 'bg-indigo-600 text-white'

                key={project._id}                : 'bg-white/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-white hover:bg-white/90 dark:hover:bg-neutral-600/90'

                initial={{ opacity: 0, y: 20 }}            }`}

                animate={{ opacity: 1, y: 0 }}          >

                transition={{ duration: 0.5, delay: index * 0.1 }}            {category}

                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-white/20 dark:border-neutral-700/50"          </button>

              >        ))}

                {/* Project Image */}      </div>

                {project.imageUrl && (

                  <div className="relative h-48 overflow-hidden">      {loading ? (

                    <img        <div className="flex justify-center items-center min-h-[400px]">

                      src={project.imageUrl}          <div className="animate-spin w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"></div>

                      alt={project.title}        </div>

                      className="w-full h-full object-cover"      ) : projects.length === 0 ? (

                    />        <div className="text-center py-20">

                    {project.featured && (          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">

                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">            No projects found

                        Featured          </h3>

                      </div>          <p className="text-neutral-600 dark:text-neutral-400">

                    )}            {selectedCategory !== 'All Projects'

                  </div>              ? `No projects in the ${selectedCategory} category.`

                )}              : 'No portfolio projects have been added yet.'}

          </p>

                {/* Project Content */}        </div>

                <div className="p-6">      ) : (

                  <div className="flex justify-between items-start mb-3">        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    <h3 className="text-xl font-bold text-neutral-800 dark:text-white">          {projects.map((project, index) => (

                      {project.title}            <motion.div

                    </h3>              key={project._id}

                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">              initial={{ opacity: 0, y: 20 }}

                      {project.category}              animate={{ opacity: 1, y: 0 }}

                    </span>              transition={{ duration: 0.5, delay: index * 0.1 }}

                  </div>              whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}

              className="bg-white/70 dark:bg-neutral-700/70 rounded-xl overflow-hidden shadow-lg border border-white/20 dark:border-neutral-600/50"

                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">            >

                    {project.description}              <div className="h-52 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center relative overflow-hidden">

                  </p>                {project.imageUrl ? (

                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">

                  {/* Technologies */}                    <motion.div 

                  <div className="flex flex-wrap gap-2 mb-4">                      className="relative w-full h-full cursor-pointer"

                    {project.technologies.map((tech, idx) => (                      whileHover={{ scale: 1.05 }}

                      <span                      transition={{ duration: 0.3 }}

                        key={idx}                      title="Click to view project"

                        className="px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"                    >

                      >                      <Image 

                        {tech}                        src={project.imageUrl} 

                      </span>                        alt={project.title} 

                    ))}                        fill

                  </div>                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                        className="object-cover"

                  {/* Links */}                      />

                  <div className="flex gap-3">                    </motion.div>

                    {project.liveUrl && (                  </a>

                      <a                ) : (

                        href={project.liveUrl}                  <div className="flex flex-col items-center justify-center">

                        target="_blank"                    <FaCode className="text-5xl mb-3 text-white/80" />

                        rel="noopener noreferrer"                    <p className="text-neutral-800 dark:text-neutral-200 font-medium text-center px-4">

                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"                      Project Preview

                      >                    </p>

                        <FaExternalLinkAlt />                  </div>

                        <span>Live Demo</span>                )}

                      </a>                {project.featured && (

                    )}                  <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-full">

                    {project.githubUrl && (                    Featured

                      <a                  </div>

                        href={project.githubUrl}                )}

                        target="_blank"              </div>

                        rel="noopener noreferrer"              

                        className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm"              <div className="p-6">

                      >                <div className="flex justify-between items-start mb-3">

                        <FaGithub />                  <h3 className="text-xl font-bold text-neutral-800 dark:text-white">

                        <span>Code</span>                    {project.title}

                      </a>                  </h3>

                    )}                  <div className="flex gap-2">

                  </div>                    {project.githubUrl && (

                      <a 

                  {/* Admin Controls */}                        href={project.githubUrl} 

                  {isAdmin && (                        target="_blank" 

                    <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">                        rel="noopener noreferrer"

                      <button                        className="text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"

                        onClick={() => router.push(`/admin/portfolio/edit/${project._id}`)}                      >

                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors text-sm"                        <FaGithub size={20} />

                      >                      </a>

                        <FaEdit />                    )}

                        <span>Edit</span>                    {project.liveUrl && (

                      </button>                      <a 

                      <button                        href={project.liveUrl} 

                        onClick={() => handleDelete(project._id)}                        target="_blank" 

                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors text-sm"                        rel="noopener noreferrer"

                      >                        className="text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"

                        <FaTrash />                      >

                        <span>Delete</span>                        <FaExternalLinkAlt size={18} />

                      </button>                      </a>

                    </div>                    )}

                  )}                  </div>

                </div>                </div>

              </motion.div>                

            ))}                <p className="text-neutral-600 dark:text-neutral-400 mb-4">

          </div>                  {project.description}

        )}                </p>

      </div>                

    </DefaultLayout>                {/* Technologies */}

  );                {project.technologies && project.technologies.length > 0 && (

}                  <div className="flex flex-wrap gap-2">

                    {project.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-white/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-300 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-white/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-300 text-xs font-medium rounded-full">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}
                
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600/50 flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/portfolio/edit/${project._id}`)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
}
