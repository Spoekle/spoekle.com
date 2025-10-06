'use client';

import DefaultLayout from '@/components/DefaultLayout';
import BlogEditorForm from '../components/BlogEditorForm';

export default function NewBlogPostPage() {
  return (
    <DefaultLayout
      title="Create Blog Post"
      subtitle="Share your thoughts and ideas"
      backgroundImage="/assets/slider/slider4.jpg"
    >
      <div className="container mx-auto px-4 py-8">
        <BlogEditorForm slug="new" />
      </div>
    </DefaultLayout>
  );
}
