'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineUploadFile, MdPhotoCamera, MdCheckCircle, MdError, MdClose, MdDelete, MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import axios from 'axios';
import { cookieUtils } from '@/lib/cookies';

interface UploadPhotoProps {
  onPhotoUploaded: () => void;
  onClose: () => void;
}

interface QueuedPhoto {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({ onPhotoUploaded, onClose }) => {
  const [queue, setQueue] = useState<QueuedPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingAll, setUploadingAll] = useState(false);

  const categories = ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'];

  const processFiles = useCallback((files: FileList | File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 40 * 1024 * 1024; // 40MB
    
    const newPhotos: QueuedPhoto[] = [];
    
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        return;
      }
      
      if (file.size > maxSize) {
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const id = `${Date.now()}-${Math.random()}`;
        const newPhoto: QueuedPhoto = {
          id,
          file,
          preview: reader.result as string,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          description: '',
          category: 'Nature',
          location: '',
          status: 'pending',
        };
        
        setQueue((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

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
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const updatePhoto = (id: string, updates: Partial<QueuedPhoto>) => {
    setQueue((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, ...updates } : photo))
    );
  };

  const removePhoto = (id: string) => {
    setQueue((prev) => prev.filter((photo) => photo.id !== id));
    if (currentIndex >= queue.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const uploadSinglePhoto = async (photo: QueuedPhoto) => {
    updatePhoto(photo.id, { status: 'uploading' });
    
    try {
      const token = cookieUtils.get('token');
      const formData = new FormData();
      formData.append('photo', photo.file);
      formData.append('title', photo.title || 'Untitled Photo');
      formData.append('description', photo.description);
      formData.append('category', photo.category);
      formData.append('location', photo.location);
      
      await axios.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      updatePhoto(photo.id, { status: 'completed' });
    } catch (err) {
      console.error('Error uploading photo:', err);
      updatePhoto(photo.id, { 
        status: 'error',
        error: 'Failed to upload. Please try again.'
      });
    }
  };

  const handleUploadAll = async () => {
    setUploadingAll(true);
    
    for (const photo of queue) {
      if (photo.status === 'pending' || photo.status === 'error') {
        await uploadSinglePhoto(photo);
      }
    }
    
    setUploadingAll(false);
    
    // Check if all uploads were successful
    const allCompleted = queue.every(p => p.status === 'completed');
    if (allCompleted) {
      setTimeout(() => {
        onPhotoUploaded();
        onClose();
      }, 1000);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentPhoto = queue[currentIndex];
  const pendingCount = queue.filter(p => p.status === 'pending' || p.status === 'error').length;
  const completedCount = queue.filter(p => p.status === 'completed').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50 relative max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition z-10"
        aria-label="Close upload form"
      >
        <MdClose size={24} />
      </button>
      
      <div className="flex items-center justify-center mb-4">
        <MdPhotoCamera className="text-3xl text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
          Upload Photos
        </h2>
      </div>

      {queue.length === 0 ? (
        <div className="mb-6">
          <label
            htmlFor="photo-upload"
            className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/20'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-neutral-100/50 dark:bg-neutral-800/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <MdOutlineUploadFile className="text-6xl text-indigo-500 dark:text-indigo-400 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium mb-2">
              Click to select or drag photos here
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              JPEG, PNG, WEBP, GIF (max 40MB each)
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
              You can select multiple photos at once
            </p>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Photo {currentIndex + 1} of {queue.length} • 
              <span className="ml-2 text-indigo-600 dark:text-indigo-400">{pendingCount} pending</span> • 
              <span className="ml-2 text-green-600 dark:text-green-400">{completedCount} completed</span>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline">
                + Add more photos
              </span>
            </label>
          </div>

          <AnimatePresence mode="wait">
            {currentPhoto && (
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="relative w-full h-64 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                    <img
                      src={currentPhoto.preview}
                      alt={currentPhoto.title}
                      className="w-full h-full object-contain"
                    />
                    {currentPhoto.status === 'completed' && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <MdCheckCircle className="text-6xl text-green-500" />
                      </div>
                    )}
                    {currentPhoto.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    {queue.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          disabled={currentIndex === 0}
                          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <MdNavigateBefore size={24} />
                        </button>
                        <button
                          onClick={goToNext}
                          disabled={currentIndex === queue.length - 1}
                          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <MdNavigateNext size={24} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removePhoto(currentPhoto.id)}
                      className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={currentPhoto.title}
                      onChange={(e) => updatePhoto(currentPhoto.id, { title: e.target.value })}
                      placeholder="Photo title"
                      className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-neutral-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Category
                    </label>
                    <select
                      value={currentPhoto.category}
                      onChange={(e) => updatePhoto(currentPhoto.id, { category: e.target.value })}
                      className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-neutral-900 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={currentPhoto.description}
                      onChange={(e) => updatePhoto(currentPhoto.id, { description: e.target.value })}
                      placeholder="Add a description (optional)"
                      rows={3}
                      className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-neutral-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={currentPhoto.location}
                      onChange={(e) => updatePhoto(currentPhoto.id, { location: e.target.value })}
                      placeholder="Where was this taken? (optional)"
                      className="w-full px-3 py-2 bg-white/70 dark:bg-neutral-700/70 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                {currentPhoto.status === 'error' && currentPhoto.error && (
                  <div className="text-red-500 flex items-center">
                    <MdError className="mr-1" />
                    {currentPhoto.error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-neutral-300 dark:border-neutral-600">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {uploadingAll ? 'Uploading all photos...' : `${pendingCount} photo${pendingCount !== 1 ? 's' : ''} ready to upload`}
            </div>
            <button
              onClick={handleUploadAll}
              disabled={uploadingAll || pendingCount === 0}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                uploadingAll || pendingCount === 0
                  ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200'
              }`}
            >
              {uploadingAll ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <MdOutlineUploadFile size={20} />
                  Upload All ({pendingCount})
                </>
              )}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default UploadPhoto;
