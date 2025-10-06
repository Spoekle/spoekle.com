'use client';

import { use } from 'react';
import DefaultLayout from '@/components/DefaultLayout';
import PortfolioEditorForm from '../../components/PortfolioEditorForm';

export default function EditPortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <DefaultLayout
      title="Edit Portfolio Project"
      subtitle="Update your development work"
      backgroundImage="/assets/coding.webp"
    >
      <div className="container mx-auto px-4 py-8">
        <PortfolioEditorForm projectId={id} />
      </div>
    </DefaultLayout>
  );
}
