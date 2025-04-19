import React from 'react';

interface PhotoEditFormProps {
  title: string;
  description: string;
  category: string;
  location: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setLocation: (location: string) => void;
  categories: string[];
  error: string;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const PhotoEditForm: React.FC<PhotoEditFormProps> = ({
  title,
  description,
  category,
  location,
  setTitle,
  setDescription,
  setCategory,
  setLocation,
  categories,
  error,
  isSaving,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-neutral-800/90 backdrop-blur-sm border border-white/10 p-6 rounded-lg w-full max-w-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Photo</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white h-24"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-neutral-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
            placeholder="Where was this photo taken?"
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditForm;
