'use client';

import { use, useEffect, useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/DefaultLayout';
import FeaturedItemEditorForm from '../../components/FeaturedItemEditorForm';

interface FeaturedItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: 'project' | 'game' | 'blog' | 'custom';
  order: number;
  active: boolean;
}

export default function EditFeaturedItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<FeaturedItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/featured/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = response.data.data || response.data;
        setItem(data);
      } catch (error) {
        console.error('Error fetching featured item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <DefaultLayout
        title="Edit Featured Item"
        subtitle="Loading..."
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

  if (!item) {
    return (
      <DefaultLayout
        title="Featured Item Not Found"
        subtitle="The item you're looking for doesn't exist"
        backgroundImage="/assets/slider/slider4.jpg"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
              Item not found
            </h3>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout
      title="Edit Featured Item"
      subtitle="Update the featured item details"
      backgroundImage="/assets/slider/slider4.jpg"
    >
      <div className="container mx-auto px-4 py-8">
        <FeaturedItemEditorForm item={item} isEdit />
      </div>
    </DefaultLayout>
  );
}
