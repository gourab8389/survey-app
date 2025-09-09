'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SurveyForm } from '@/types/form.types';
import { generateDynamicFormSchema } from '@/lib/validations';
import FormFieldRenderer from './FormFieldRenderer';

interface DynamicFormProps {
  surveyForm: SurveyForm;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function DynamicForm({ surveyForm, onSubmit, isLoading }: DynamicFormProps) {
  const schema = generateDynamicFormSchema(surveyForm.fields);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: surveyForm.fields.reduce((acc, field) => {
      acc[field.id] = field.type === 'checkbox' ? [] : '';
      return acc;
    }, {} as Record<string, any>),
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{surveyForm.title}</CardTitle>
          <p className="text-muted-foreground">{surveyForm.description}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {surveyForm.fields.map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  control={form.control}
                />
              ))}
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
                  Submit Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}