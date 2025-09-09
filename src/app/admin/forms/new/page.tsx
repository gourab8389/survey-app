'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormBuilder from '@/components/forms/FormBuilder';
import ProtectedRoute from '@/components/forms/ProtectedRoute';

export default function NewFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create form');
      return response.json();
    },
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      router.push('/admin');
    },
  });

  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Create New Form</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {createMutation.error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>
                Failed to create form. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <FormBuilder
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}