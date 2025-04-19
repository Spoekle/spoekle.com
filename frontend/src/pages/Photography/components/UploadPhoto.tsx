// Create a new file for UploadPhoto component
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineUploadFile, MdPhotoCamera, MdCheckCircle, MdError, MdClose } from 'react-icons/md';
import axios from 'axios';

interface UploadPhotoProps {
  onPhotoUploaded: () => void;
  token: string;
  onClose: () => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({ onPhotoUploaded, token, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nature');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Categories based on the schema
  const categories = ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'];

  // Process file (shared between drag and click uploads)
  const processFile = useCallback((selectedFile: File) => {
    // Reset status
    setError('');
    setSuccess(false);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.');
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Validate file size (40MB max)
    if (selectedFile.size > 40 * 1024 * 1024) {
      setError('File size exceeds 40MB limit.');
      setFile(null);
      setPreview(null);
      return;
    }
    
    // Set file and create preview
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a photo to upload.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('title', title || 'Untitled Photo');
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      
      await axios.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Reset form
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setCategory('Nature');
        setLocation('');
        setFile(null);
        setPreview(null);
        setSuccess(false);
        
        // Notify parent component that upload is complete
        onPhotoUploaded();
      }, 1000);
      
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 mb-8 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
        aria-label="Close upload form"
      >
        <MdClose size={24} />
      </button>
      <div className="flex items-center justify-center mb-4">
        <MdPhotoCamera className="text-3xl text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
          Upload New Photo
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div className="mb-6">
          <label
            htmlFor="photo-upload"
            className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/20'
                : preview
                ? 'border-indigo-400 dark:border-indigo-500 bg-white/50 dark:bg-neutral-700/50'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-neutral-100/50 dark:bg-neutral-800/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative w-full h-full">
                <img
                  src={preview}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white bg-black/50 px-2 py-1 rounded">Click to change photo</p>
                </div>
              </div>
            ) : (
              <>
                <MdOutlineUploadFile className="text-4xl text-indigo-500 dark:text-indigo-400 mb-2" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Click to select or drag a photo here
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  JPEG, PNG, WEBP, GIF (max 40MB)
                </p>
              </>
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Photo title"
              className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description of your photo (optional)"
              rows={3}
              className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this photo taken? (optional)"
              className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>
        </div>
        
        {/* Status Messages */}
        {error && (
          <div className="text-red-500 flex items-center">
            <MdError className="mr-1" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 flex items-center">
            <MdCheckCircle className="mr-1" />
            Photo uploaded successfully!
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !file}
            className={`px-4 py-2 rounded-lg flex items-center ${
              loading || !file
                ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200'
            }`}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Uploading...
              </>
            ) : (
              'Upload Photo'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UploadPhoto;
