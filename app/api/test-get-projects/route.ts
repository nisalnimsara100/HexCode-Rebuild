import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export async function GET() {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    let projects = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      projects = Array.isArray(data) ? data : [];
    }
    
    return NextResponse.json({
      success: true,
      projects: projects,
      count: projects.length
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      projects: []
    }, { status: 500 });
  }
}