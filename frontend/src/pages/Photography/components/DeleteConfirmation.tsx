import React from 'react';
import { motion } from 'framer-motion';
import { MdWarning } from 'react-icons/md';

interface DeleteConfirmationProps {
  isDeleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isDeleting,
  error,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-neutral-800 rounded-lg p-6 max-w-md mx-auto border border-neutral-700"
      >
        <div className="flex items-center mb-4 text-red-500">
          <MdWarning size={24} className="mr-2" />
          <h3 className="text-xl font-bold">Delete Photo</h3>
        </div>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to delete this photo? This action cannot be undone.
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Deleting...
              </>
            ) : (
              'Delete Photo'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmation;
