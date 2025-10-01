import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const fileName: string | null = data.get('fileName') as string;
    const folder: string | null = data.get('folder') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    if (!fileName || !folder) {
      return NextResponse.json({ error: 'Missing fileName or folder.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the path to save the file
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder);
    const filePath = path.join(uploadDir, fileName);

    // Write the file to the filesystem
    await writeFile(filePath, buffer);

    // Return the public path to the file
    const publicPath = `/images/${folder}/${fileName}`;

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      path: publicPath
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}