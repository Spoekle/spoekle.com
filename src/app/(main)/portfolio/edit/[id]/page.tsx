'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/DefaultLayout';
import PortfolioEditorForm from '../../components/PortfolioEditorForm';
import { useAuth } from '@/context/AuthContext';

export default function EditPortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && (!user || !user.roles?.includes('admin'))) {
      router.push('/portfolio');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user || !user.roles?.includes('admin')) {
    return (
      <DefaultLayout
        title="Edit Portfolio Project"
        subtitle="Update your development work"
        backgroundImage="/assets/coding.webp"
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
