'use client';

import { use } from 'react';
import DefaultLayout from '@/components/DefaultLayout';
import BlogEditorForm from '../../components/BlogEditorForm';

export default function EditBlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

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
