import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DefaultLayout from '../../layouts/DefaultLayout';
import PhotoGallery from './components/PhotoGallery';
import UploadPhoto from './components/UploadPhoto';

import photography from '../../assets/photography.webp';

const PhotographyPage: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [galleryKey, setGalleryKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.roles?.includes('admin') || false);
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handlePhotoUploaded = () => {
    setGalleryKey(prevKey => prevKey + 1);
    setShowUploadForm(false);
  };

  return (
    <DefaultLayout
      title="Photography"
      subtitle="Look through some pictures I took"
      backgroundImage={photography}
      metaDescription="Photography page - Explore my photography work and projects"
    >
      <div className="bg-neutral-200 dark:bg-neutral-900 transition duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center mb-8">
            {isAdmin && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Upload Photo
              </button>
            )}
          </div>

          <PhotoGallery key={galleryKey} />

          <AnimatePresence>
            {showUploadForm && token && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              >
                <UploadPhoto 
                  onPhotoUploaded={handlePhotoUploaded}
                  token={token}
                  onClose={() => setShowUploadForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PhotographyPage;
