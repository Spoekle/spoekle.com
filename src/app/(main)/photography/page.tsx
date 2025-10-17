'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCamera, FaClock, FaUpload, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import DefaultLayout from '@/components/DefaultLayout';
import UploadPhoto from './components/UploadPhoto';
import { cookieUtils } from '@/lib/cookies';

interface Photo {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  createdAt: string;
  metadata?: {
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    location?: string;
    gpsLocation?: {
      latitude: number;
      longitude: number;
    };
    takenAt?: string;
    width?: number;
    height?: number;
    format?: string;
  };
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchPhotos();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = cookieUtils.get('token');
      if (!token) return;
      
      const response = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data || response.data;
      setIsAdmin(userData.roles?.includes('admin') || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photos');
      // API responses are wrapped in { success: true, data: [...] }
      setPhotos(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const token = cookieUtils.get('token');
      await axios.delete(`/api/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPhotos(photos.filter(p => p._id !== photoId));
      closeLightbox();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const handlePhotoUploaded = () => {
    fetchPhotos();
    setShowUploadForm(false);
  };

  return (
    <DefaultLayout
      title="Photography"
      subtitle="Look through some pictures I took"
      backgroundImage="/assets/photography.webp"
    >
      <div className="bg-neutral-50 dark:bg-neutral-950 transition duration-200 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Upload Button for Admins */}
          {isAdmin && (
            <div className="flex justify-center mb-12">
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center gap-2 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
              >
                <FaUpload />
                Upload Photo
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin w-16 h-16 border-4 border-neutral-900 dark:border-white rounded-full border-t-transparent"></div>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-32">
              <FaCamera className="text-8xl text-neutral-400 dark:text-neutral-600 mx-auto mb-6" />
              <p className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">No photos yet.</p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">Check back later for new photos!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => openLightbox(photo, index)}
                className="relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] aspect-square cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none group"
              >
                <Image
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-white/80 text-sm line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 text-white hover:text-neutral-300 p-3 z-50 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <FaChevronLeft className="text-4xl" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 text-white hover:text-neutral-300 p-3 z-50 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <FaChevronRight className="text-4xl" />
            </button>

            <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-6" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex-1 relative aspect-video lg:aspect-auto lg:h-[80vh]"
              >
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="lg:w-96 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-8 overflow-y-auto border border-white/10"
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 z-50 hover:cursor-pointer bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <FaTimes className="text-3xl" />
                </button>
                <h2 className="text-3xl font-black text-white mb-6">{selectedPhoto.title}</h2>
                
                {selectedPhoto.description && (
                  <p className="text-neutral-300 mb-6">{selectedPhoto.description}</p>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <FaClock />
                    <span className="text-sm">{formatDate(selectedPhoto.createdAt)}</span>
                  </div>

                  {selectedPhoto.category && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Category</h3>
                      <p className="text-white">{selectedPhoto.category}</p>
                    </div>
                  )}

                  {selectedPhoto.metadata?.location && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Location</h3>
                      <p className="text-white">{selectedPhoto.metadata.location}</p>
                    </div>
                  )}

                  {selectedPhoto.metadata?.gpsLocation && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">GPS Coordinates</h3>
                      <p className="text-white text-xs">
                        {selectedPhoto.metadata.gpsLocation.latitude.toFixed(6)}, {selectedPhoto.metadata.gpsLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}

                  {selectedPhoto.metadata?.takenAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Photo Taken</h3>
                      <p className="text-white">{formatDate(selectedPhoto.metadata.takenAt)}</p>
                    </div>
                  )}

                  {selectedPhoto.metadata?.camera && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Camera</h3>
                      <p className="text-white">{selectedPhoto.metadata.camera}</p>
                    </div>
                  )}

                  {selectedPhoto.metadata?.lens && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Lens</h3>
                      <p className="text-white">{selectedPhoto.metadata.lens}</p>
                    </div>
                  )}

                  {(selectedPhoto.metadata?.iso || selectedPhoto.metadata?.aperture || selectedPhoto.metadata?.shutterSpeed || selectedPhoto.metadata?.focalLength) && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-2">Camera Settings</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {selectedPhoto.metadata.iso && (
                          <div>
                            <span className="text-neutral-400">ISO:</span>
                            <span className="text-white ml-2">{selectedPhoto.metadata.iso}</span>
                          </div>
                        )}
                        {selectedPhoto.metadata.aperture && (
                          <div>
                            <span className="text-neutral-400">Aperture:</span>
                            <span className="text-white ml-2">{selectedPhoto.metadata.aperture}</span>
                          </div>
                        )}
                        {selectedPhoto.metadata.shutterSpeed && (
                          <div>
                            <span className="text-neutral-400">Shutter:</span>
                            <span className="text-white ml-2">{selectedPhoto.metadata.shutterSpeed}</span>
                          </div>
                        )}
                        {selectedPhoto.metadata.focalLength && (
                          <div>
                            <span className="text-neutral-400">Focal Length:</span>
                            <span className="text-white ml-2">{selectedPhoto.metadata.focalLength}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedPhoto.metadata?.width && selectedPhoto.metadata?.height && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-400 mb-1">Dimensions</h3>
                      <p className="text-white">{selectedPhoto.metadata.width} × {selectedPhoto.metadata.height}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-700 text-sm text-neutral-400">
                  Photo {currentIndex + 1} of {photos.length}
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="mt-6 pt-6 border-t border-neutral-700 flex gap-2">
                    <button
                      onClick={() => handleDeletePhoto(selectedPhoto._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-300"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowUploadForm(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <UploadPhoto
                  onPhotoUploaded={handlePhotoUploaded}
                  onClose={() => setShowUploadForm(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </DefaultLayout>
  );
}
