'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { createFormSchema } from '@/lib/validations';
import { FormField as FormFieldType, SurveyForm } from '@/types/form.types';
import { generateId } from '@/lib/utils';

interface FormBuilderProps {
  initialData?: SurveyForm;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function FormBuilder({ initialData, onSubmit, isLoading }: FormBuilderProps) {
  const [optionsInput, setOptionsInput] = useState<Record<string, string>>({});

  const form = useForm({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      fields: initialData?.fields || [
        {
          id: generateId(),
          type: 'text' as const,
          label: '',
          description: '',
          placeholder: '',
          required: false,
          validation: 'string' as const,
          options: [],
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  const watchedFields = form.watch('fields');

  const addField = () => {
    append({
      id: generateId(),
      type: 'text',
      label: '',
      description: '',
      placeholder: '',
      required: false,
      validation: 'string',
      options: [],
    });
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addOption = (fieldIndex: number) => {
    const currentOptions = form.getValues(`fields.${fieldIndex}.options`) || [];
    const newOption = optionsInput[fieldIndex]?.trim();
    
    if (newOption && !currentOptions.includes(newOption)) {
      form.setValue(`fields.${fieldIndex}.options`, [...currentOptions, newOption]);
      setOptionsInput({ ...optionsInput, [fieldIndex]: '' });
    }
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`fields.${fieldIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, index) => index !== optionIndex);
    form.setValue(`fields.${fieldIndex}.options`, newOptions);
  };

  const needsOptions = (type: string) => {
    return ['select', 'radio', 'checkbox'].includes(type);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Form' : 'Create New Form'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter form title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter form description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Form Fields</h3>
                <Button type="button" onClick={addField} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Field {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeField(index)}
                      disabled={fields.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Field label" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Text Input</SelectItem>
                              <SelectItem value="email">Email Input</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select Dropdown</SelectItem>
                              <SelectItem value="radio">Radio Buttons</SelectItem>
                              <SelectItem value="checkbox">Checkboxes</SelectItem>
                              <SelectItem value="file">Single File Upload</SelectItem>
                              <SelectItem value="multiple-file">Multiple File Upload</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Field description or instructions" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${index}.validation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Validation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select validation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.placeholder`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Placeholder (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Field placeholder text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Required Field</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {needsOptions(watchedFields[index]?.type) && (
                    <div className="space-y-2">
                      <FormLabel>Options</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add option"
                          value={optionsInput[index] || ''}
                          onChange={(e) => setOptionsInput({
                            ...optionsInput,
                            [index]: e.target.value
                          })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addOption(index);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addOption(index)}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="space-y-1">
                        {(form.watch(`fields.${index}.options`) || []).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex justify-between items-center p-2 bg-muted rounded">
                            <span>{option}</span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeOption(index, optionIndex)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
                <Save className="w-4 h-4 mr-2" />
                {initialData ? 'Update Form' : 'Create Form'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}