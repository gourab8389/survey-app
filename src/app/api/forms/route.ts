import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';
import { SurveyForm } from '@/types/form.types';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const forms = await googleSheetsService.getAllForms();
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newForm: SurveyForm = {
      id: generateId(),
      title: data.title,
      description: data.description,
      fields: data.fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await googleSheetsService.createFormSheet(newForm);
    
    return NextResponse.json(newForm);
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}