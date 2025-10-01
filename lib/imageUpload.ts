/**
 * Image upload utility for handling profile pictures
 * Saves images to /public/images/profiles/ folder
 */

export async function uploadProfileImage(file: File, employeeId: string): Promise<string> {
  try {
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${employeeId}_profile.${fileExtension}`;
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('folder', 'profiles');

    // Upload to the API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return result.path;
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