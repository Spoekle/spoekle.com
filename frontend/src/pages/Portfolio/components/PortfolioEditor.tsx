// filepath: /data/compose/spoekle.com/frontend/src/pages/Portfolio/PortfolioEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaSave, FaArrowLeft, FaTrash, FaImage } from 'react-icons/fa';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { useNotification } from '../../../context/NotificationContext';
import IconSelector from '../IconSelector';

// Import background image for consistency with portfolio page
import portfolioBackground from '../../../assets/slider/slider5.png';

interface PortfolioProject {
  _id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  techs: string[];
  category: string;
  featured: boolean;
  order: number;
}

const PortfolioEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [project, setProject] = useState<PortfolioProject>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    github: '',
    techs: [],
    category: 'Web Development',
    featured: false,
    order: 999
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  // Fetch project data if in edit mode
  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      fetchProjectData(id);
    }
  }, [id]);

  const fetchProjectData = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolio/${projectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      
      const projectData = await response.json();
      setProject(projectData);
    } catch (error) {
      console.error('Error fetching project:', error);
      showError('Failed to load project data');
      navigate('/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'featured') {
      setProject(prev => ({ ...prev, featured: (e.target as HTMLInputElement).checked }));
    } else if (name === 'order') {
      setProject(prev => ({ ...prev, order: parseInt(value) || 999 }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setImageUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('/api/storage/portfolio-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setProject(prev => ({ ...prev, image: data.imageUrl }));
      showSuccess('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() === '') return;
    
    // Prevent adding duplicate tags
    if (project.tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    setProject(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Handle selecting/deselecting a tech icon
  const handleTechSelection = (tech: string) => {
    setProject(prev => {
      // If tech is already selected, remove it
      if (prev.techs.includes(tech)) {
        return {
          ...prev,
          techs: prev.techs.filter(t => t !== tech)
        };
      } 
      // Otherwise, add it
      else {
        return {
          ...prev,
          techs: [...prev.techs, tech]
        };
      }
    });
  };

  const saveProject = async () => {
    // Validate required fields
    if (!project.title.trim() || !project.description.trim()) {
      showError('Title and description are required');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('You must be logged in to save a project');
        navigate('/login');
        return;
      }
      
      const url = isEditing
        ? `/api/portfolio/${id}`
        : '/api/portfolio';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save project');
      }
      
      showSuccess(`Project ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/portfolio');
    } catch (error) {
      console.error('Error saving project:', error);
      showError(`Failed to ${isEditing ? 'update' : 'create'} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!isEditing || !id) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      showSuccess('Project deleted successfully');
      navigate('/portfolio');
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('Failed to delete project');
    } finally {
      setLoading(false);
      setDeleteConfirmation(false);
    }
  };

  return (
    <DefaultLayout
      title={isEditing ? "Edit Project" : "Add New Project"}
      subtitle="Portfolio Management"
      backgroundImage={portfolioBackground}
      metaDescription="Create or edit portfolio projects"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 mb-8"
        >
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Portfolio
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => setDeleteConfirmation(true)}
                className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                disabled={loading}
              >
                <FaTrash className="mr-2" /> Delete Project
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="animate-spin text-3xl text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); saveProject(); }}>
              {/* Project Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  Project Title *
                </label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  value={project.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter project title"
                />
              </div>
              
              {/* Project Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Describe your project"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Image */}
                <div className="mb-6">
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    Project Image
                  </label>
                  <div>
                    {project.image ? (
                      <div className="relative mb-2">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-40 object-cover rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => setProject(prev => ({ ...prev, image: '' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-2 flex items-center justify-center">
                        <FaImage className="text-neutral-400 dark:text-neutral-500 text-3xl" />
                      </div>
                    )}
                    <label className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      {imageUploading ? (
                        <span className="flex items-center">
                          <FaSpinner className="animate-spin mr-2" /> Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FaImage className="mr-2" /> Select Image
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={imageUploading}
                      />
                    </label>
                  </div>
                </div>
                
                {/* Project Category */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    Category *
                  </label>
                  <select 
                    id="category"
                    name="category"
                    value={project.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Applications">Applications</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub Link */}
                <div className="mb-6">
                  <label htmlFor="github" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    GitHub Repository URL
                  </label>
                  <input 
                    type="url"
                    id="github"
                    name="github"
                    value={project.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                {/* Live Link */}
                <div className="mb-6">
                  <label htmlFor="link" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    Live Project URL
                  </label>
                  <input 
                    type="url"
                    id="link"
                    name="link"
                    value={project.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              {/* Project Tags */}
              <div className="mb-6">
                <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-sm"
                    >
                      {tag}
                      <button 
                        type="button"
                        onClick={() => removeTag(tag)} 
                        className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="flex-1 px-4 py-2 rounded-l-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="Add a tag"
                  />
                  <button 
                    type="button"
                    onClick={addTag} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Press Enter to add a tag
                </p>
              </div>
              
              {/* Technology Icons */}
              <div className="mb-6">
                <h3 className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  Select Technology Icons
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Choose the technologies used in this project. These will be displayed as icons on the project card.
                </p>
                
                <IconSelector 
                  selectedTechs={project.techs} 
                  onSelectTech={handleTechSelection} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={project.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="featured" className="ml-2 block text-neutral-700 dark:text-neutral-300 font-medium">
                      Featured Project
                    </label>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 ml-6">
                    Featured projects appear first in the portfolio
                  </p>
                </div>
                
                {/* Display Order */}
                <div className="mb-6">
                  <label htmlFor="order" className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    Display Order
                  </label>
                  <input 
                    type="number"
                    id="order"
                    name="order"
                    value={project.order}
                    onChange={handleInputChange}
                    min="1"
                    max="999"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Lower numbers appear first (default: 999)
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-8">
                <button 
                  type="submit"
                  disabled={loading || imageUploading}
                  className="flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaSave className="mr-2" /> {isEditing ? 'Update Project' : 'Save Project'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {/* Delete Confirmation Dialog */}
          {deleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
                  Confirm Delete
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteConfirmation(false)}
                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" /> Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default PortfolioEditor;
