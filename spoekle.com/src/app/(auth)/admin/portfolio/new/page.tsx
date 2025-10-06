'use client';

import DefaultLayout from '@/components/DefaultLayout';
import PortfolioEditorForm from '../components/PortfolioEditorForm';

export default function NewPortfolioProjectPage() {
  return (
    <DefaultLayout
      title="Create Portfolio Project"
      subtitle="Showcase your development work"
      backgroundImage="/assets/coding.webp"
    >
      <div className="container mx-auto px-4 py-8">
        <PortfolioEditorForm projectId="new" />
      </div>
    </DefaultLayout>
  );
}
