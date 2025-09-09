'use client';

import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField as FormFieldType } from '@/types/form.types';

interface FormFieldRendererProps {
  field: FormFieldType;
  control: Control<any>;
}

export default function FormFieldRenderer({ field, control }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={option} />
                        <FormLabel className="font-normal">{option}</FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
                {field.options?.map((option) => (
                  <FormField
                    key={option}
                    control={control}
                    name={field.id}
                    render={({ field: checkboxField }) => {
                      return (
                        <FormItem
                          key={option}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={checkboxField.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                const currentValue = checkboxField.value || [];
                                if (checked) {
                                  checkboxField.onChange([...currentValue, option]);
                                } else {
                                  checkboxField.onChange(
                                    currentValue.filter((value: string) => value !== option)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'file':
      case 'multiple-file':
        return (
          <FormField
            control={control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormControl>
                  <Input
                    type="file"
                    multiple={field.type === 'multiple-file'}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      formField.onChange(field.type === 'multiple-file' ? files : files[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
}