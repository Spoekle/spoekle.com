'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaImage, FaTimes, FaArrowLeft, FaPlus, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

interface PortfolioEditorFormProps {
  projectId?: string;
}

const categories = ['Web Development', 'Applications', 'Open Source', 'Other'];

export default function PortfolioEditorForm({ projectId }: PortfolioEditorFormProps) {
  const router = useRouter();
  
  const [project, setProject] = useState<PortfolioProject>({
    title: '',
    description: '',
    imageUrl: '',
    technologies: [],
    category: 'Web Development',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 999,
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [techInput, setTechInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch project data if in edit mode
  useEffect(() => {
    if (projectId && projectId !== 'new') {
      setIsEditing(true);
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/portfolio/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data.data || response.data;
      setProject({
        id: data._id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || '',
        technologies: data.technologies || [],
        category: data.category,
        githubUrl: data.githubUrl || '',
        liveUrl: data.liveUrl || '',
        featured: data.featured || false,
        order: data.order || 999,
      });
    } catch (error) {
      setError('Failed to load project data');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProject(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setProject(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !project.technologies.includes(techInput.trim())) {
      setProject(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setProject(prev => ({ 
      ...prev, 
      technologies: prev.technologies.filter(tech => tech !== techToRemove) 
    }));
  };

  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setImageUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', files[0]);

      const response = await axios.post('/api/storage/portfolio-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      const data = response.data;
      const imageUrl = data.data?.imageUrl || data.imageUrl;
      setProject(prev => ({ ...prev, imageUrl }));
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload image. Using URL input instead.');
      console.error('Error uploading image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const saveProject = async () => {
    // Validate form
    if (!project.title.trim() || !project.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: isEditing ? 'PUT' : 'POST',
        url: `/api/portfolio${isEditing && project.id ? `/${project.id}` : ''}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          technologies: project.technologies,
          category: project.category,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          featured: project.featured,
          order: project.order,
        }
      });

      setSuccess(`Project ${isEditing ? 'updated' : 'created'} successfully`);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/portfolio');
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred while saving the project';
      setError(message);
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50"
    >
      {/* Notifications */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}

      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.push('/portfolio')}
          className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Portfolio
        </button>
        
        <button
          onClick={saveProject}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={project.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
            Project Image
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors">
                <FaImage className="mr-2" />
                {imageUploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">or enter URL below</span>
            </div>
            <input
              type="text"
              name="imageUrl"
              value={project.imageUrl}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
            {project.imageUrl && (
              <div className="flex items-center gap-3">
                <img 
                  src={project.imageUrl} 
                  alt="Preview" 
                  className="h-20 w-32 object-cover rounded"
                />
                <button
                  onClick={() => setProject(prev => ({ ...prev, imageUrl: '' }))}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              <FaGithub /> GitHub URL
            </label>
            <input
              type="text"
              name="githubUrl"
              value={project.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              <FaExternalLinkAlt /> Live Demo URL
            </label>
            <input
              type="text"
              name="liveUrl"
              value={project.liveUrl}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
            Technologies
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {project.technologies.map(tech => (
              <span
                key={tech}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300 flex items-center"
              >
                {tech}
                <button
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-neutral-500 hover:text-red-500"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechInputKeyDown}
              placeholder="Add a technology and press Enter"
              className="flex-1 px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
            <button
              onClick={addTechnology}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={project.order}
              onChange={handleInputChange}
              placeholder="999"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Lower numbers appear first</p>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Featured Project
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={project.featured}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-neutral-700 dark:text-neutral-300">
                Display as featured
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
