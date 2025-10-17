'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaUser, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import MDEditor from '@uiw/react-md-editor';

interface BlogPost {
  id: string;
  title: string;
  content: string;
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blog/${slug}`);
      // API responses are wrapped in { success: true, data: {...} }
      setPost(response.data.data || response.data);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      if (error.response?.status === 404) {
        router.push('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin w-16 h-16 border-4 border-neutral-900 dark:border-white rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="pt-28"/>
      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[500px] w-full mb-12 rounded-3xl overflow-hidden mx-auto max-w-7xl px-4"
        >
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover "
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 font-semibold text-lg mb-8 transition-colors"
        >
          <FaArrowLeft />
          Back to Blog
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-neutral-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              <div className="flex items-center gap-2">
                <FaUser />
                <span className="font-medium">{post.author.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{formatDate(post.publishedDate)}</span>
                { post.publishedDate !== post.updatedDate && (<span> (Last updated: {formatDate(post.updatedDate)})</span>)}
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900/50 backdrop-blur-xl text-neutral-900 dark:text-white rounded-xl text-sm font-semibold border border-neutral-200 dark:border-white/10"
                  >
                    <FaTag className="text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:text-neutral-900 dark:prose-headings:text-white
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed
              prose-a:text-neutral-900 dark:prose-a:text-white prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-neutral-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-em:text-neutral-800 dark:prose-em:text-neutral-200
              prose-code:text-neutral-900 dark:prose-code:text-white
              prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
              prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono
              prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-950
              prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-white/10
              prose-pre:text-neutral-100 dark:prose-pre:text-neutral-200
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-l-neutral-900 dark:prose-blockquote:border-l-white
              prose-blockquote:bg-neutral-100 dark:prose-blockquote:bg-neutral-900/50
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
              prose-blockquote:text-neutral-800 dark:prose-blockquote:text-neutral-200
              prose-li:text-neutral-700 dark:prose-li:text-neutral-300
              prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300
              prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300
              prose-hr:border-neutral-300 dark:prose-hr:border-neutral-700
              prose-table:text-neutral-700 dark:prose-table:text-neutral-300
              prose-th:text-neutral-900 dark:prose-th:text-white
              prose-td:text-neutral-700 dark:prose-td:text-neutral-300"
            data-color-mode={isDark ? 'dark' : 'light'}
          >
            <MDEditor.Markdown 
              source={post.content}
              style={{
                backgroundColor: 'transparent',
                color: isDark ? 'rgb(212 212 212)' : 'rgb(64 64 64)'
              }}
            />
          </motion.div>
        </article>
      </div>
    </div>
  );
}
