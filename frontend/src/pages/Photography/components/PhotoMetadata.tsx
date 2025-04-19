import React from 'react';
import { motion } from 'framer-motion';
import { MdPhotoCamera, MdClose } from 'react-icons/md';

interface PhotoMetadataProps {
  photo: {
    title: string;
    description?: string;
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
  };
  onClose: () => void;
}

// Helper function to format shutter speed
const formatShutterSpeed = (shutterSpeed: string): string => {
  // Check if it's already in the 1/x format
  if (shutterSpeed.includes('/')) {
    return shutterSpeed;
  }
  
  // Try to convert from decimal (e.g., 0.005) to fraction (1/200)
  try {
    const decimalValue = parseFloat(shutterSpeed);
    if (!isNaN(decimalValue) && decimalValue > 0 && decimalValue < 1) {
      const denominator = Math.round(1 / decimalValue);
      return `1/${denominator}`;
    }
  } catch (e) {
    // If conversion fails, return the original value
  }
  
  return shutterSpeed;
};

const PhotoMetadata: React.FC<PhotoMetadataProps> = ({ photo, onClose }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-black/75 backdrop-blur-sm flex flex-col overflow-auto z-10 max-h-[70%]"
    >
      <div className="flex items-center justify-between p-3 border-b border-white/20">
        <h2 className="text-lg font-bold text-white">{photo.title}</h2>
        <button 
          onClick={onClose}
          className="bg-white/20 rounded-full p-1 text-white hover:bg-white/30 transition"
          aria-label="Close information panel"
        >
          <MdClose size={20} />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        {photo.description && (
          <p className="text-neutral-300 mb-3 text-sm">{photo.description}</p>
        )}
        
        <div className="border-t border-white/20 pt-3 mt-2">
          <h3 className="text-md font-medium text-white mb-2 flex items-center">
            <MdPhotoCamera className="mr-2" />
            Photo Details
          </h3>
          
          <div className="space-y-1 text-sm">
            {photo.metadata.camera && (
              <div>
                <span className="text-neutral-400">Camera:</span>
                <span className="text-white ml-2">{photo.metadata.camera}</span>
              </div>
            )}
            
            {photo.metadata.lens && (
              <div>
                <span className="text-neutral-400">Lens:</span>
                <span className="text-white ml-2">{photo.metadata.lens}</span>
              </div>
            )}
            
            {photo.metadata.aperture && (
              <div>
                <span className="text-neutral-400">Aperture:</span>
                <span className="text-white ml-2">{photo.metadata.aperture}</span>
              </div>
            )}
            
            {photo.metadata.shutterSpeed && (
              <div>
                <span className="text-neutral-400">Shutter Speed:</span>
                <span className="text-white ml-2">{formatShutterSpeed(photo.metadata.shutterSpeed)}</span>
              </div>
            )}
            
            {photo.metadata.iso && (
              <div>
                <span className="text-neutral-400">ISO:</span>
                <span className="text-white ml-2">{photo.metadata.iso}</span>
              </div>
            )}
            
            {photo.metadata.focalLength && (
              <div>
                <span className="text-neutral-400">Focal Length:</span>
                <span className="text-white ml-2">{photo.metadata.focalLength}</span>
              </div>
            )}
            
            {photo.metadata.location && (
              <div>
                <span className="text-neutral-400">Location:</span>
                <span className="text-white ml-2">{photo.metadata.location}</span>
              </div>
            )}
            
            {photo.metadata.takenAt && (
              <div>
                <span className="text-neutral-400">Date Taken:</span>
                <span className="text-white ml-2">
                  {new Date(photo.metadata.takenAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-2 mt-2 text-sm">
          <span className="text-neutral-400">Category:</span>
          <span className="text-white ml-2">{photo.category}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoMetadata;
