'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaUser, FaRegNewspaper, FaSearch, FaPlus, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import DefaultLayout from '@/components/DefaultLayout';
import { cookieUtils } from '@/lib/cookies';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  publishedDate: string;
  updatedDate: string;
  tags: string[];
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is admin
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = cookieUtils.get('token');
      
      if (token) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data.data || response.data;
          setIsAdmin(userData.roles && userData.roles.includes('admin'));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedTag]);

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
      let url = `/api/blog?page=${page}&limit=6`;
      
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }

      const response = await axios.get(url);
      // API responses are wrapped in { success: true, data: { posts, pagination } }
      const responseData = response.data.data || response.data;
      setPosts(responseData.posts);
      setFilteredPosts(responseData.posts);
      setTotalPages(responseData.pagination.pages);
      
      // Collect all unique tags
      const tags = new Set<string>();
      responseData.posts.forEach((post: BlogPost) => {
        post.tags.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DefaultLayout
      title="Blog"
      subtitle="Thoughts, tutorials, and updates"
      backgroundImage="/assets/slider/slider4.jpg"
    >
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-100/80 dark:bg-neutral-950/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg dark:shadow-none"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center mb-6 md:mb-0">
              <FaRegNewspaper className="text-5xl text-neutral-900 dark:text-white mr-4" />
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white">
                  Blog
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
                  Thoughts, updates, and tutorials
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-4 pr-10 py-3 w-full sm:w-72 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-neutral-900 dark:text-white shadow-lg dark:shadow-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 dark:text-neutral-400"
                >
                  <FaSearch />
                </button>
              </form>
              
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/blog/new')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
                >
                  <FaPlus />
                  <span>Create Post</span>
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-3">
              <span className="text-base font-semibold text-neutral-900 dark:text-white self-center mr-2">
                Filter by tag:
              </span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                      : 'bg-white/80 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-5xl text-neutral-900 dark:text-white" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                No blog posts found
              </h3>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {searchTerm || selectedTag
                  ? "No posts match your search criteria. Try different keywords or tags."
                  : "No blog posts have been published yet. Check back soon!"}
              </p>
              {isAdmin && !searchTerm && !selectedTag && (
                <button
                  onClick={() => router.push('/blog/new')}
                  className="mt-6 px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none flex flex-col"
                  >
                    {post.featuredImage && (
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-48 overflow-hidden cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                          >
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                        </div>
                      </Link>
                    )}
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-xs" />
                          <span>{post.author.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-xs" />
                          <span>{formatDate(post.publishedDate)}</span>
                        </div>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-neutral-600 dark:text-neutral-400 mb-6 flex-grow line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full"
                            >
                              <FaTag className="text-xs" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 font-semibold"
                      >
                        Read more →
                      </Link>
                      
                      {isAdmin && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <button
                            onClick={() => router.push(`/blog/edit/${post.slug}`)}
                            className="text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 text-sm font-semibold"
                          >
                            Edit Post
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 rounded-xl bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
                  >
                    Previous
                  </button>
                  <span className="px-6 py-3 text-neutral-900 dark:text-white font-semibold">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-3 rounded-xl bg-white/80 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none"
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
}
