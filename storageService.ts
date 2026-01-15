// src/services/storageService.ts
// Firebase Storage service for photos

import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../firebase';

// ============================================
// PHOTO UPLOAD
// ============================================

/**
 * Upload a photo file to Firebase Storage
 * Returns the download URL
 */
export async function uploadPhoto(
  userId: string,
  file: File,
  index: number = 0
): Promise<string> {
  // Compress the image first
  const compressed = await compressImage(file, 800, 0.8);
  
  // Convert base64 to blob
  const response = await fetch(compressed);
  const blob = await response.blob();
  
  // Create storage reference
  const photoRef = ref(storage, `users/${userId}/photos/photo_${index}_${Date.now()}.jpg`);
  
  // Upload
  await uploadBytes(photoRef, blob, {
    contentType: 'image/jpeg'
  });
  
  // Get download URL
  return getDownloadURL(photoRef);
}

/**
 * Upload a base64 image string directly
 */
export async function uploadBase64Photo(
  userId: string,
  base64Data: string,
  index: number = 0
): Promise<string> {
  const photoRef = ref(storage, `users/${userId}/photos/photo_${index}_${Date.now()}.jpg`);
  
  // Remove data URL prefix if present
  const base64Content = base64Data.includes(',') 
    ? base64Data.split(',')[1] 
    : base64Data;
  
  await uploadString(photoRef, base64Content, 'base64', {
    contentType: 'image/jpeg'
  });
  
  return getDownloadURL(photoRef);
}

/**
 * Upload a story image
 */
export async function uploadStory(
  userId: string,
  file: File | string
): Promise<string> {
  const storyRef = ref(storage, `users/${userId}/stories/story_${Date.now()}.jpg`);
  
  if (typeof file === 'string') {
    // Base64 string
    const base64Content = file.includes(',') ? file.split(',')[1] : file;
    await uploadString(storyRef, base64Content, 'base64', {
      contentType: 'image/jpeg'
    });
  } else {
    // File object
    const compressed = await compressImage(file, 600, 0.7);
    const response = await fetch(compressed);
    const blob = await response.blob();
    await uploadBytes(storyRef, blob, { contentType: 'image/jpeg' });
  }
  
  return getDownloadURL(storyRef);
}

/**
 * Upload a chat image
 */
export async function uploadChatImage(
  matchId: string,
  userId: string,
  file: File | string
): Promise<string> {
  const imageRef = ref(storage, `chats/${matchId}/${userId}_${Date.now()}.jpg`);
  
  if (typeof file === 'string') {
    const base64Content = file.includes(',') ? file.split(',')[1] : file;
    await uploadString(imageRef, base64Content, 'base64', {
      contentType: 'image/jpeg'
    });
  } else {
    const compressed = await compressImage(file, 800, 0.8);
    const response = await fetch(compressed);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });
  }
  
  return getDownloadURL(imageRef);
}

/**
 * Upload a moment image
 */
export async function uploadMomentImage(
  userId: string,
  file: File | string
): Promise<string> {
  const momentRef = ref(storage, `moments/${userId}_${Date.now()}.jpg`);
  
  if (typeof file === 'string') {
    const base64Content = file.includes(',') ? file.split(',')[1] : file;
    await uploadString(momentRef, base64Content, 'base64', {
      contentType: 'image/jpeg'
    });
  } else {
    const compressed = await compressImage(file, 1000, 0.85);
    const response = await fetch(compressed);
    const blob = await response.blob();
    await uploadBytes(momentRef, blob, { contentType: 'image/jpeg' });
  }
  
  return getDownloadURL(momentRef);
}

// ============================================
// PHOTO DELETION
// ============================================

/**
 * Delete a photo by URL
 */
export async function deletePhoto(photoUrl: string): Promise<void> {
  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    console.error('Failed to delete photo:', error);
  }
}

/**
 * Delete all user photos
 */
export async function deleteAllUserPhotos(userId: string): Promise<void> {
  try {
    const photosRef = ref(storage, `users/${userId}/photos`);
    const list = await listAll(photosRef);
    
    await Promise.all(list.items.map(item => deleteObject(item)));
  } catch (error) {
    console.error('Failed to delete user photos:', error);
  }
}

// ============================================
// IMAGE COMPRESSION
// ============================================

/**
 * Compress an image file
 * Returns base64 data URL
 */
export function compressImage(
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image (size, dimensions, type)
 */
export async function validateImage(
  file: File,
  options: {
    maxSizeMB?: number;
    minWidth?: number;
    minHeight?: number;
    allowedTypes?: string[];
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const {
    maxSizeMB = 10,
    minWidth = 200,
    minHeight = 200,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  } = options;
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please use JPG, PNG, or WebP.' };
  }
  
  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return { valid: false, error: `Image too large. Max size is ${maxSizeMB}MB.` };
  }
  
  // Check dimensions
  try {
    const { width, height } = await getImageDimensions(file);
    if (width < minWidth || height < minHeight) {
      return { valid: false, error: `Image too small. Minimum ${minWidth}x${minHeight}px.` };
    }
  } catch {
    return { valid: false, error: 'Failed to read image.' };
  }
  
  return { valid: true };
}
