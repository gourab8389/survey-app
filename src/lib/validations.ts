import { z } from 'zod';
import { FormField } from '@/types/form.types';

export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'email', 'textarea', 'select', 'radio', 'checkbox', 'file', 'multiple-file']),
    label: z.string().min(1, 'Label is required'),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    required: z.boolean(),
    validation: z.enum(['string', 'number', 'email', 'file']),
    options: z.array(z.string()).optional(),
  })).min(1, 'At least one field is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export function generateDynamicFormSchema(fields: FormField[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach(field => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (field.validation) {
      case 'email':
        fieldSchema = z.string().email('Invalid email format');
        break;
      case 'number':
        fieldSchema = z.string().regex(/^\d+$/, 'Must be a number');
        break;
      case 'file':
        fieldSchema = z.any(); // File validation handled separately
        break;
      default:
        fieldSchema = z.string();
    }
    
    if (field.required) {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }
    
    schemaFields[field.id] = fieldSchema;
  });
  
  return z.object(schemaFields);
}