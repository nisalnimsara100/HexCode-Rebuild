/**
 * Upload a generic file to Hostinger Server via PHP script
 */
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Use the PHP script in the public folder
    const response = await fetch('/upload.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || `Upload failed: ${response.statusText}`);
      } catch (e) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    }

    const result = await response.json();
    return result.path;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    // Return a mock URL if running locally and PHP fails (optional dev experience improvement)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Returning mock URL for local development');
      return URL.createObjectURL(file);
    }
    throw new Error(error.message || 'Failed to upload file');
  }
}

export async function uploadProfileImage(file: File, employeeId: string): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${employeeId}_profile.${fileExtension}`;
    const storagePath = `profiles/${fileName}`;

    // Create a new file with the new name to ensure consistency
    const renamedFile = new File([file], fileName, { type: file.type });

    return await uploadFile(renamedFile, 'profiles');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return { isValid: true };
}