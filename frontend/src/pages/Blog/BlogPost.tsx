// filepath: /data/compose/spoekle.com/frontend/src/pages/Blog/BlogPost.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRegClock, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import MDEditor from '@uiw/react-md-editor';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useNotification } from '../../context/NotificationContext';
import axios from 'axios';

// Import blog background image
import blogBackground from '../../assets/slider/slider4.jpg';

interface Author {
  id: string;
  username: string;
  profilePicture: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
  author: Author;
  publishedDate: string;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is admin by fetching the user data from the API
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data;
          setIsAdmin(userData.roles && userData.roles.includes('admin'));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchCurrentUser();
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          navigate('/blog');
          return;
        }
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      showError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      showSuccess('Blog post deleted successfully');
      navigate('/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      showError('Failed to delete blog post');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DefaultLayout
        title="Loading..."
        subtitle="Please wait"
        backgroundImage={blogBackground}
        metaDescription="Loading blog post..."
      >
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!post) {
    return (
      <DefaultLayout
        title="Post Not Found"
        subtitle="The blog post you're looking for doesn't exist"
        backgroundImage={blogBackground}
        metaDescription="Blog post not found"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
              Post Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The blog post you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate('/blog')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Blog
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout
      title={post.title}
      subtitle="Blog Post"
      backgroundImage={post.featuredImage || blogBackground}
      metaDescription={post.excerpt}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50"
        >
          <div className="mb-6 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </button>
            
            {isAdmin && (
              <div className="flex space-x-3 ml-auto">
                <button
                  onClick={() => navigate(`/blog/edit/${post.slug}`)}
                  className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors font-medium"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                
                {deleteConfirmation ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          
          <article className="max-w-4xl mx-auto">
            {post.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <img
                  src={post.author.profilePicture}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {post.author.username}
                </span>
              </div>
              
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <FaRegClock className="mr-1" />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
            </div>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8 bg-white/95 dark:bg-neutral-900/95 p-8 rounded-xl shadow-md border border-gray-100 dark:border-neutral-800">
              <MDEditor.Markdown 
                source={post.content} 
                className="markdown-body" 
                style={{ backgroundColor: 'transparent', color: 'inherit' }}
              />
            </div>
          </article>
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default BlogPost;
