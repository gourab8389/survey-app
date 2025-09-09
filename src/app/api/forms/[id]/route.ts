import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await googleSheetsService.getFormById(params.id);
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    
    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const existingForm = await googleSheetsService.getFormById(params.id);
    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    
    const updatedForm = {
      ...existingForm,
      title: data.title,
      description: data.description,
      fields: data.fields,
      updatedAt: new Date().toISOString(),
    };
    
    await googleSheetsService.updateForm(updatedForm);
    
    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await googleSheetsService.deleteForm(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}