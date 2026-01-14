import { NextRequest, NextResponse } from 'next/server';
import { submitClientProjectRequest } from '@/lib/client-projects-firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const projectId = await submitClientProjectRequest(body);
    
    return NextResponse.json({
      success: true,
      projectId: projectId,
      message: 'Test project created successfully'
    });
    
  } catch (error) {
    console.error('Error creating test project:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}