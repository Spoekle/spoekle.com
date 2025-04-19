import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineZoomIn, MdPhotoCamera } from 'react-icons/md';
import axios from 'axios';
import PhotoModal from './PhotoModal';

interface Photo {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  metadata: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    takenAt?: string;
    location?: string;
  };
  createdAt: string;
}

interface PhotoGalleryProps {
  initialCategory?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ initialCategory = 'All' }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(-1);

  // Categories based on the schema
  const categories = ['All', 'Nature', 'Urban', 'Travel', 'Portrait', 'Other'];

  useEffect(() => {
    fetchPhotos();
  }, [currentCategory, currentPage]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (currentCategory !== 'All') {
        queryParams.append('category', currentCategory);
      }
      
      const response = await axios.get(`/api/photos?${queryParams.toString()}`);
      setPhotos(response.data.photos);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos. Please try again later.');
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
    setModalOpen(true);
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      setSelectedPhoto(photos[selectedPhotoIndex + 1]);
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhoto(photos[selectedPhotoIndex - 1]);
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };
  
  // Refresh the gallery when a photo is deleted
  const handlePhotoDeleted = () => {
    fetchPhotos();
  };
  
  // Refresh the photo details when a photo is updated
  const handlePhotoUpdated = async () => {
    if (selectedPhoto) {
      try {
        // Fetch the updated photo details
        const response = await axios.get(`/api/photos/${selectedPhoto._id}`);
        setSelectedPhoto(response.data);
        
        // Also refresh the gallery to show updated thumbnails
        fetchPhotos();
      } catch (err) {
        console.error('Error fetching updated photo:', err);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full shadow-md transition duration-200 ${
              currentCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-white/70 dark:bg-neutral-700/70 text-neutral-800 dark:text-white hover:bg-white/90 dark:hover:bg-neutral-600/90'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 text-neutral-600 dark:text-neutral-400">
          <MdPhotoCamera className="mx-auto text-4xl mb-3 text-neutral-400 dark:text-neutral-600" />
          <p>No photos found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white/70 dark:bg-neutral-700/70 rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={() => handlePhotoClick(photo, index)}
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity duration-300">
                  <button className="p-2 bg-white/80 text-neutral-900 rounded-full">
                    <MdOutlineZoomIn size={24} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-neutral-800 dark:text-white truncate">{photo.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{photo.category}</p>
                {photo.metadata && photo.metadata.camera && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 flex items-center">
                    <MdPhotoCamera className="mr-1" size={12} />
                    {photo.metadata.camera}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 mb-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40'
            }`}
          >
            Previous
          </button>
          
          <span className="px-3 py-1 text-neutral-600 dark:text-neutral-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasNext={selectedPhotoIndex < photos.length - 1}
        hasPrev={selectedPhotoIndex > 0}
        onPhotoDeleted={handlePhotoDeleted}
        onPhotoUpdated={handlePhotoUpdated}
      />
    </div>
  );
};

export default PhotoGallery;
