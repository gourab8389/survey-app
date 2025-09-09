'use client';

import DynamicForm from '@/components/forms/DynamicForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'multiple-file';
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  validation: 'string' | 'number' | 'email' | 'file';
  options?: string[];
}

export interface SurveyForm {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export default function PublicFormPage({ params }: { params: { id: string } }) {
  const { data: form, isLoading, error } = useQuery({
    queryKey: ['form', params.id],
    queryFn: async (): Promise<SurveyForm> => {
      const response = await fetch(`/api/forms/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Form not found');
        }
        throw new Error('Failed to fetch form');
      }
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: params.id,
          data,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      return response.json();
    },
    onSuccess: () => {
      alert('Form submitted successfully!');
    },
    onError: (error) => {
      console.error('Submission error:', error);
      alert('Failed to submit form. Please try again.');
    },
  });

  const handleSubmit = (data: any) => {
    // Handle file uploads by converting FileList to file names
    const processedData = { ...data };
    
    if (form) {
      form.fields.forEach(field => {
        if (field.type === 'file' || field.type === 'multiple-file') {
          const files = processedData[field.id];
          if (files) {
            if (field.type === 'multiple-file' && Array.isArray(files)) {
              processedData[field.id] = files.map((file: File) => file.name);
            } else if (files instanceof File) {
              processedData[field.id] = files.name;
            }
          }
        }
      });
    }
    
    submitMutation.mutate(processedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading form...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Alert variant="destructive">
              <AlertDescription>
                {error.message === 'Form not found' 
                  ? 'This form does not exist or has been removed.' 
                  : 'Failed to load form. Please try again later.'}
              </AlertDescription>
            </Alert>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  return (
    <DynamicForm
      surveyForm={form}
      onSubmit={handleSubmit}
      isLoading={submitMutation.isPending}
    />
  );
}