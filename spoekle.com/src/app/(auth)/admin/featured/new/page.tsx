'use client';

import DefaultLayout from '@/components/DefaultLayout';
import FeaturedItemEditorForm from '../components/FeaturedItemEditorForm';

export default function NewFeaturedItemPage() {
  return (
    <DefaultLayout
      title="Create Featured Item"
      subtitle="Add a new item to the homepage"
      backgroundImage="/assets/slider/slider4.jpg"
    >
      <div className="container mx-auto px-4 py-8">
        <FeaturedItemEditorForm />
      </div>
    </DefaultLayout>
  );
}
