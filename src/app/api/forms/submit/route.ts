import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';
import { FormSubmission } from '@/types/form.types';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { formId, data } = await request.json();
    
    const form = await googleSheetsService.getFormById(formId);
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    
    const submission: FormSubmission = {
      id: generateId(),
      formId,
      data,
      submittedAt: new Date().toISOString(),
    };
    
    await googleSheetsService.submitFormResponse(submission, form);
    
    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}