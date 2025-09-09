'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/forms/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import { SurveyForm } from '@/types/form.types';
import { formatDate } from '@/lib/utils';
import FormBuilder from '@/components/forms/FormBuilder';

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: forms = [], isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: async (): Promise<SurveyForm[]> => {
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to fetch forms');
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete form');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setDeletingId(null);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      setDeletingId(null);
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Edit Form: {form?.title}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {updateMutation.error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>
                Failed to update form. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {form && (
            <FormBuilder
              initialData={form}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}