'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/DefaultLayout';
import BlogEditorForm from '../../components/BlogEditorForm';
import { useAuth } from '@/context/AuthContext';

export default function EditBlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && (!user || !user.roles?.includes('admin'))) {
      router.push('/blog');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || !user.roles?.includes('admin')) {
    return (
      <DefaultLayout
        title="Edit Blog Post"
        subtitle="Update your content"
        backgroundImage="/assets/slider/slider4.jpg"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout
      title="Edit Blog Post"
      subtitle="Update your content"
      backgroundImage="/assets/slider/slider4.jpg"
    >
      <div className="container mx-auto px-4 py-8">
        <BlogEditorForm slug={slug} />
      </div>
    </DefaultLayout>
  );
}
