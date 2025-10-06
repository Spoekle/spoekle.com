'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaUpload, FaStar } from 'react-icons/fa';
import axios from 'axios';

interface FeaturedItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: 'project' | 'game' | 'blog' | 'custom';
  order: number;
  active: boolean;
}

interface FeaturedItemEditorFormProps {
  item?: FeaturedItem;
  isEdit?: boolean;
}

export default function FeaturedItemEditorForm({ item, isEdit = false }: FeaturedItemEditorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(item?.imageUrl || '');
  
  const [formData, setFormData] = useState<FeaturedItem>({
    title: item?.title || '',
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    linkUrl: item?.linkUrl || '',
    type: item?.type || 'project',
    order: item?.order || 0,
    active: item?.active !== undefined ? item.active : true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      return formData.imageUrl;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('image', imageFile);

    const token = localStorage.getItem('token');
    const response = await axios.post('/api/storage/featured-image', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl || response.data.data?.imageUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Upload image if a new one was selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const dataToSend = {
        ...formData,
        imageUrl,
      };

      if (isEdit && item?._id) {
        await axios.put(`/api/featured/${item._id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post('/api/featured', dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      router.push('/admin/featured');
      router.refresh();
    } catch (error) {
      console.error('Error saving featured item:', error);
      alert('Failed to save featured item');
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'order') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50"
    >
      <div className="flex items-center mb-6">
        <FaStar className="text-4xl text-yellow-500 mr-4" />
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            {isEdit ? 'Edit Featured Item' : 'Create Featured Item'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {isEdit ? 'Update the featured item details' : 'Add a new item to the homepage'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-800 dark:text-white"
            placeholder="Enter item title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-800 dark:text-white resize-none"
            placeholder="Enter item description"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Featured Image *
          </label>
          <div className="flex flex-col gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            )}
            <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white rounded-lg transition-colors border border-neutral-300 dark:border-neutral-600">
              <FaUpload />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Link URL */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Link URL *
          </label>
          <input
            type="url"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-800 dark:text-white"
            placeholder="https://example.com"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-800 dark:text-white"
          >
            <option value="project">Project</option>
            <option value="game">Game</option>
            <option value="blog">Blog</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Order *
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-800 dark:text-white"
            placeholder="0"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Lower numbers appear first
          </p>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            id="active"
            className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Display on homepage
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/featured')}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
        >
          <FaTimes />
          <span>Cancel</span>
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>{isEdit ? 'Update' : 'Create'}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
