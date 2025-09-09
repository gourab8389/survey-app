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

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

export interface AuthUser {
  email: string;
  isAuthenticated: boolean;
  loginTime: number;
}