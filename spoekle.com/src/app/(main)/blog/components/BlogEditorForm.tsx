'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSave, FaImage, FaTimes, FaArrowLeft, FaEye } from 'react-icons/fa';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
  tags: string[];
  status: 'draft' | 'published';
}

interface BlogEditorFormProps {
  slug?: string;
}

export default function BlogEditorForm({ slug }: BlogEditorFormProps) {
  const router = useRouter();
  
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    slug: '',
    tags: [],
    status: 'published'
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch post data if in edit mode
  useEffect(() => {
    if (slug && slug !== 'new') {
      setIsEditing(true);
      fetchPostData(slug);
    }
  }, [slug]);

  const fetchPostData = async (slug: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/blog/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data.data || response.data;
      setPost({
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage || '',
        slug: data.slug,
        tags: data.tags || [],
        status: data.status || 'published'
      });
    } catch (error) {
      setError('Failed to load post data');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string | undefined) => {
    setPost(prev => ({ ...prev, content: value || '' }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPost(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }));
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setImageUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('blogImage', files[0]);

      const response = await axios.post('/api/storage/blog-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      const data = response.data;
      // Handle both wrapped and unwrapped responses
      const imageUrl = data.data?.imageUrl || data.imageUrl;
      setPost(prev => ({ ...prev, featuredImage: imageUrl }));
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload image');
      console.error('Error uploading image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const savePost = async () => {
    // Validate form
    if (!post.title.trim() || !post.content.trim()) {
      setError('Title and content are required');
      return;
    }

    // Auto-generate excerpt if empty
    if (!post.excerpt.trim()) {
      // Strip markdown and limit to 150 chars
      const plainText = post.content.replace(/[#*_\[\]()~`>]/g, '').trim();
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      post.excerpt = excerpt;
    }

    // Auto-generate slug if empty
    if (!post.slug.trim()) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const response = await axios({
        method: isEditing ? 'PUT' : 'POST',
        url: `/api/blog${isEditing && post.id ? `/${post.id}` : ''}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: post
      });

      const data = response.data.data || response.data;
      setSuccess(`Post ${isEditing ? 'updated' : 'created'} successfully`);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/blog/${data.slug || slug}`);
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred while saving the post';
      setError(message);
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50"
    >
      {/* Notifications */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}

      {/* Top navigation bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.push('/blog')}
          className="flex items-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Blog
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-3 py-1.5 rounded-lg ${
              previewMode 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
            } transition-colors`}
          >
            <FaEye className="mr-2" /> {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          
          <button
            onClick={savePost}
            disabled={loading}
            className="flex items-center px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-md">
          {post.featuredImage && (
            <div className="mb-6">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">{post.title}</h1>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDEditor.Markdown source={post.content} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              URL Slug (optional)
            </label>
            <input
              type="text"
              name="slug"
              value={post.slug}
              onChange={handleInputChange}
              placeholder="Enter URL slug (or leave blank to generate automatically)"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors">
                <FaImage className="mr-2" />
                {imageUploading ? 'Uploading...' : 'Select Image'}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
              {post.featuredImage && (
                <div className="flex-1 flex items-center">
                  <img 
                    src={post.featuredImage} 
                    alt="Featured" 
                    className="h-12 w-12 object-cover rounded"
                  />
                  <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 truncate flex-1">
                    {post.featuredImage.split('/').pop()}
                  </span>
                  <button
                    onClick={() => setPost(prev => ({ ...prev, featuredImage: '' }))}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Content (Markdown supported)
            </label>
            <MDEditor
              value={post.content}
              onChange={handleContentChange}
              height={400}
              preview="edit"
            />
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Excerpt (optional)
            </label>
            <textarea
              name="excerpt"
              value={post.excerpt}
              onChange={handleInputChange}
              placeholder="Enter a short excerpt (or leave blank to generate automatically)"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300 flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-neutral-500 hover:text-red-500"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Status
            </label>
            <select
              name="status"
              value={post.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
}
