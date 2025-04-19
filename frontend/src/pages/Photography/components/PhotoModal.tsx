import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { MdInfoOutline } from 'react-icons/md';

import ModalHeader from './ModalHeader';
import DeleteConfirmation from './DeleteConfirmation';
import PhotoEditForm from './PhotoEditForm';
import PhotoMetadata from './PhotoMetadata';

interface Photo {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  userId?: string;
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

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPhotoDeleted?: () => void;
  onPhotoUpdated?: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  isOpen, 
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onPhotoDeleted,
  onPhotoUpdated
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id?: string; roles?: string[] }>({});
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const categories = ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'];

  useEffect(() => {
    if (photo && isEditing) {
      setEditTitle(photo.title);
      setEditDescription(photo.description || '');
      setEditCategory(photo.category);
      setEditLocation(photo.metadata.location || '');
    }
  }, [photo, isEditing]);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  // Calculate if user has edit/delete permission
  const hasEditDeletePermission = (): boolean => {
    if (!currentUser || !photo) return false;
    return Boolean(
      currentUser.roles?.includes('admin') ||
      (photo.userId && photo.userId === currentUser.id)
    );
  };

  const handleDeletePhoto = async () => {
    if (!photo) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`/api/photos/${photo._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsDeleting(false);
      setDeleteConfirm(false);
      
      if (onPhotoDeleted) {
        onPhotoDeleted();
      }
      onClose();
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo. Please try again.');
      setIsDeleting(false);
    }
  };
  
  const handleSavePhoto = async () => {
    if (!photo) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const updatedData = {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        location: editLocation
      };
      
      await axios.put(`/api/photos/${photo._id}`, updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIsSaving(false);
      setIsEditing(false);
      
      if (onPhotoUpdated) {
        onPhotoUpdated();
      }
    } catch (err) {
      console.error('Error updating photo:', err);
      setError('Failed to update photo. Please try again.');
      setIsSaving(false);
    }
  };
  
  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div 
            className="w-full h-full max-w-6xl max-h-full flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {deleteConfirm && (
              <DeleteConfirmation 
                isDeleting={isDeleting}
                error={error}
                onCancel={() => setDeleteConfirm(false)}
                onConfirm={handleDeletePhoto}
              />
            )}
            
            <div className="flex-grow flex items-center justify-center overflow-hidden relative rounded-lg">
              {isEditing ? (
                <PhotoEditForm 
                  title={editTitle}
                  description={editDescription}
                  category={editCategory}
                  location={editLocation}
                  setTitle={setEditTitle}
                  setDescription={setEditDescription}
                  setCategory={setEditCategory}
                  setLocation={setEditLocation}
                  categories={categories}
                  error={error}
                  isSaving={isSaving}
                  onSave={handleSavePhoto}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative overflow-hidden">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.title} 
                      className="max-h-[80vh] max-w-full object-contain"
                    />
                    
                    {/* Header controls */}
                    <div className="absolute top-4 right-4">
                      <ModalHeader 
                        onClose={onClose}
                        hasEditDeletePermission={hasEditDeletePermission()}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        setDeleteConfirm={setDeleteConfirm}
                        handleSavePhoto={handleSavePhoto}
                        isSaving={isSaving}
                      />
                    </div>
                    
                    {/* Navigation buttons */}
                    <div className="absolute left-4 inset-y-0 flex items-center">
                      {hasPrev && (
                        <button 
                          onClick={onPrev}
                          className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
                          aria-label="Previous photo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="absolute right-4 inset-y-0 flex items-center">
                      {hasNext && (
                        <button 
                          onClick={onNext}
                          className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
                          aria-label="Next photo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Info toggle button at the bottom */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
                        aria-label="Toggle information panel"
                      >
                        <MdInfoOutline size={24} />
                      </button>
                    </div>
                    
                    {/* Photo metadata panel that slides up from bottom */}
                    <div className='absolute bottom-0 left-0 right-0'>
                      <AnimatePresence>
                        {showInfo && !isEditing && (
                          <PhotoMetadata 
                            photo={photo} 
                            onClose={() => setShowInfo(false)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
