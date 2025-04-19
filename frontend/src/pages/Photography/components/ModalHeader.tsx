import React from 'react';
import { MdClose, MdEdit, MdDelete, MdSave, MdCancel } from 'react-icons/md';

interface ModalHeaderProps {
  onClose: () => void;
  hasEditDeletePermission: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  setDeleteConfirm: (confirm: boolean) => void;
  handleSavePhoto: () => void;
  isSaving: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  hasEditDeletePermission,
  isEditing,
  setIsEditing,
  setDeleteConfirm,
  handleSavePhoto,
  isSaving
}) => {
  return (
    <div className="absolute top-0 right-0 flex space-x-2 z-50 backdrop:blur-sm bg-neutral-800/90 border border-white/10 rounded-lg p-2">
      {/* Only show edit/delete buttons if user has permission */}
      {hasEditDeletePermission && !isEditing && (
        <>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
            aria-label="Edit photo"
          >
            <MdEdit size={24} />
          </button>
          <button 
            onClick={() => setDeleteConfirm(true)}
            className="bg-red-500/80 rounded-full p-2 text-white hover:bg-red-600/80 transition"
            aria-label="Delete photo"
          >
            <MdDelete size={24} />
          </button>
        </>
      )}
      
      {/* Show save/cancel buttons when in edit mode */}
      {isEditing && (
        <>
          <button 
            onClick={handleSavePhoto}
            className="bg-green-500/80 rounded-full p-2 text-white hover:bg-green-600/80 transition"
            aria-label="Save changes"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MdSave size={24} />
            )}
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
            aria-label="Cancel edit"
          >
            <MdCancel size={24} />
          </button>
        </>
      )}
      
      <button 
        onClick={onClose}
        className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition"
        aria-label="Close modal"
      >
        <MdClose size={24} />
      </button>
    </div>
  );
};

export default ModalHeader;
