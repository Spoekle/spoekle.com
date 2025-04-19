// filepath: /data/compose/spoekle.com/frontend/src/pages/Blog/Index.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRegNewspaper, FaRegClock, FaSearch, FaPlus, FaSpinner } from 'react-icons/fa';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useNotification } from '../../context/NotificationContext';

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
  excerpt: string;
  slug: string;
  featuredImage: string;
  author: Author;
  publishedDate: string;
  tags: string[];
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);

  // Check if user is admin by fetching user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.roles && userData.roles.includes('admin'));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTag]);

  // Filter posts based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `/api/blog?page=${currentPage}&limit=6`;
      
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }
      
      if (searchTerm.trim() !== '') {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);
      
      // Collect all unique tags
      const tags = new Set<string>();
      data.posts.forEach((post: BlogPost) => {
        post.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      showError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadMore = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <DefaultLayout
      title="Blog"
      subtitle="Thoughts, tutorials, and updates"
      backgroundImage={blogBackground}
      metaDescription="Spoekle's blog - articles about development, gaming, and creative projects"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 dark:border-neutral-700/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <FaRegNewspaper className="text-4xl text-indigo-600 dark:text-indigo-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Blog
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Thoughts, updates, and tutorials
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-4 pr-10 py-2 w-full sm:w-64 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/70 dark:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
                >
                  <FaSearch />
                </button>
              </form>
              
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/blog/new')}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <FaPlus />
                  <span>Create Post</span>
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400 self-center mr-2">
                Filter by tag:
              </span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-3xl text-indigo-600 dark:text-indigo-400" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                No blog posts found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {searchTerm || selectedTag
                  ? "No posts match your search criteria. Try different keywords or tags."
                  : "No blog posts have been published yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              {/* Blog posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/60 dark:bg-neutral-700/60 rounded-lg shadow overflow-hidden border border-white/20 dark:border-neutral-600/50 flex flex-col"
                  >
                    <div className="h-48 relative overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-r from-purple-400/30 to-indigo-400/30 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                          <FaRegNewspaper className="text-4xl text-neutral-600 dark:text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        <img
                          src={post.author.profilePicture}
                          alt={post.author.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="mr-3">{post.author.username}</span>
                        <FaRegClock className="mr-1" />
                        <span>{formatDate(post.publishedDate)}</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map(tag => (
                            <span
                              key={`${post.id}-${tag}`}
                              className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-600 rounded-full text-xs text-neutral-700 dark:text-neutral-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => handleReadMore(post.slug)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors mt-auto text-left"
                      >
                        Read More →
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-full ${
                          currentPage === i + 1
                            ? 'bg-indigo-600 text-white'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
};

export default BlogPage;
