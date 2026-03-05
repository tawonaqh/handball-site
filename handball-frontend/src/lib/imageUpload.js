/**
 * Upload a single image to the backend
 * @param {string} imageData - Base64 encoded image or URL
 * @param {string} folder - Optional folder name (ads, news, teams, etc.)
 * @returns {Promise<string>} - Returns the image URL
 */
export async function uploadImage(imageData, folder = 'uploads') {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        folder: folder
      })
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple images to the backend
 * @param {string[]} images - Array of base64 encoded images or URLs
 * @param {string} folder - Optional folder name
 * @returns {Promise<string[]>} - Returns array of image URLs
 */
export async function uploadMultipleImages(images, folder = 'uploads') {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images,
        folder: folder
      })
    });

    if (!response.ok) {
      throw new Error('Images upload failed');
    }

    const data = await response.json();
    return data.images.map(img => img.url);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

/**
 * Delete an image from the backend
 * @param {string} path - Path to the image file
 * @returns {Promise<boolean>} - Returns true if successful
 */
export async function deleteImage(path) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path })
    });

    if (!response.ok) {
      throw new Error('Image deletion failed');
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Convert a file to base64
 * @param {File} file - File object
 * @returns {Promise<string>} - Returns base64 encoded string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
