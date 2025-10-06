'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaUser, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

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
  tags: string[];
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin w-16 h-16 border-4 border-purple-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline mb-6"
        >
          <FaArrowLeft />
          Back to Blog
        </Link>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] w-full mb-8"
        >
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-neutral-400 mb-6">
              <div className="flex items-center gap-2">
                <FaUser />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{formatDate(post.publishedDate)}</span>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
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
              prose-headings:font-bold
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-p:text-neutral-700 dark:prose-p:text-neutral-300
              prose-a:text-purple-600 dark:prose-a:text-purple-400
              prose-strong:text-neutral-900 dark:prose-strong:text-white
              prose-code:text-purple-600 dark:prose-code:text-purple-400
              prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
              prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-950
              prose-img:rounded-xl
              prose-blockquote:border-l-purple-600
              prose-li:text-neutral-700 dark:prose-li:text-neutral-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
