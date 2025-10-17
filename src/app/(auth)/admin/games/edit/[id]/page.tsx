'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import DefaultLayout from '@/components/DefaultLayout';
import { cookieUtils } from '@/lib/cookies';
import Image from 'next/image';

interface GameFormData {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  icon: string;
  color: string;
  about: string[];
  review: string;
  downloads: Array<{title: string, description: string, downloadUrl: string, buttonColor: string}>;
  images: Array<{url: string, alt: string, caption: string}>;
  active: boolean;
}

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthLoading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<GameFormData>({
    id: '',
    name: '',
    shortDescription: '',
    image: '',
    icon: 'SiUnity',
    color: 'from-blue-500 to-purple-600',
    about: [''],
    review: '',
    downloads: [],
    images: [],
    active: true
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthLoading && (!user || !user.roles?.includes('admin'))) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  // Load game data
  useEffect(() => {
    const loadGame = async () => {
      if (!params.id) return;
      
      try {
        const token = cookieUtils.get('token');
        const response = await axios.get(`/api/games/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const game = response.data.data || response.data;
        setFormData({
          id: game.id,
          name: game.name,
          shortDescription: game.shortDescription,
          image: game.image,
          icon: game.icon,
          color: game.color,
          about: game.about || [''],
          review: game.review || '',
          downloads: game.downloads || [],
          images: game.images || [],
          active: game.active
        });
        setImagePreview(game.image || '');
      } catch (error) {
        console.error('Error loading game:', error);
        showError('Failed to load game data');
      } finally {
        setInitialLoading(false);
      }
    };

    if (!isAuthLoading && user?.roles?.includes('admin')) {
      loadGame();
    }
  }, [params.id, user, isAuthLoading, showError]);

  if (isAuthLoading || !user || !user.roles?.includes('admin')) {
    return null;
  }

  if (initialLoading) {
    return (
      <DefaultLayout
        title="Edit Game"
        subtitle="Loading..."
        backgroundImage="/assets/admin.jpg"
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <BiLoaderCircle className="animate-spin text-6xl text-indigo-600" />
        </div>
      </DefaultLayout>
    );
  }

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
      return formData.image;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('image', imageFile);

    const token = cookieUtils.get('token');
    const response = await axios.post('/api/storage/game-image', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl || response.data.data?.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id || !formData.name || !formData.shortDescription || (!formData.image && !imageFile) || !formData.about[0]) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = cookieUtils.get('token');
      
      // Upload image if a new one was selected
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const dataToSend = {
        ...formData,
        image: imageUrl,
      };

      await axios.put(`/api/games/${params.id}`, dataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      showSuccess('Game updated successfully!');
      router.push('/admin?tab=games');
    } catch (error: any) {
      console.error('Error updating game:', error);
      showError(error.response?.data?.message || 'Failed to update game');
    } finally {
      setLoading(false);
    }
  };

  const addAboutParagraph = () => {
    setFormData(prev => ({
      ...prev,
      about: [...prev.about, '']
    }));
  };

  const updateAboutParagraph = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      about: prev.about.map((p, i) => i === index ? value : p)
    }));
  };

  const removeAboutParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      about: prev.about.filter((_, i) => i !== index)
    }));
  };

  const addDownload = () => {
    setFormData(prev => ({
      ...prev,
      downloads: [...prev.downloads, { title: '', description: '', downloadUrl: '', buttonColor: 'indigo' }]
    }));
  };

  const updateDownload = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      downloads: prev.downloads.map((d, i) => i === index ? {...d, [field]: value} : d)
    }));
  };

  const removeDownload = (index: number) => {
    setFormData(prev => ({
      ...prev,
      downloads: prev.downloads.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', caption: '' }]
    }));
  };

  const updateImage = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? {...img, [field]: value} : img)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <DefaultLayout
      title={`Edit ${formData.name}`}
      subtitle="Update game information"
      backgroundImage="/assets/admin.jpg"
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/admin?tab=games')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-colors shadow-md"
        >
          <FaArrowLeft />
          Back to Admin
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white border-b pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Game ID * (URL-friendly, lowercase)
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="e.g., minecraft"
                  required
                />
                <p className="text-xs text-amber-600 mt-1">Warning: Changing the ID will break existing URLs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Game Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="e.g., Minecraft"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  placeholder="One-line description for the card"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Game Image *
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                      >
                        <FaUpload />
                        {imageFile ? imageFile.name : 'Upload New Image'}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      placeholder="Or enter URL: /assets/game-image.jpg"
                    />
                  </div>
                  {(imagePreview || formData.image) && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-600">
                      <Image
                        src={imagePreview || formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Icon Name *
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    placeholder="e.g., SiUnity"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">From react-icons</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Gradient Color *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    placeholder="from-blue-500 to-purple-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* About Paragraphs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white border-b pb-2">
                  About Section *
                </h3>
                <button
                  type="button"
                  onClick={addAboutParagraph}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FaPlus /> Add Paragraph
                </button>
              </div>

              {formData.about.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateAboutParagraph(index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    rows={3}
                    placeholder={`Paragraph ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.about.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAboutParagraph(index)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                rows={4}
                placeholder="Your personal review of the game"
              />
            </div>

            {/* Downloads (Optional) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white border-b pb-2">
                  Downloads (Optional)
                </h3>
                <button
                  type="button"
                  onClick={addDownload}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FaPlus /> Add Download
                </button>
              </div>

              {formData.downloads.map((download, index) => (
                <div key={index} className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-900 dark:text-white">Download {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDownload(index)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={download.title}
                    onChange={(e) => updateDownload(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    placeholder="Title"
                  />
                  <textarea
                    value={download.description}
                    onChange={(e) => updateDownload(index, 'description', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={download.downloadUrl}
                    onChange={(e) => updateDownload(index, 'downloadUrl', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    placeholder="/download/file.zip"
                  />
                  <select
                    value={download.buttonColor}
                    onChange={(e) => updateDownload(index, 'buttonColor', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="indigo">Indigo</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="active" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Active (visible on games page)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <BiLoaderCircle className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Game'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin?tab=games')}
                className="px-6 py-3 bg-neutral-400 dark:bg-neutral-700 hover:bg-neutral-500 dark:hover:bg-neutral-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
