# Image Upload System Setup

## Overview
The handball website now has a complete image upload system that allows uploading images from the frontend and storing them on the Laravel backend.

## Backend Setup

### 1. Storage Link
First, create a symbolic link from `public/storage` to `storage/app/public`:

```bash
php artisan storage:link
```

This command creates a symbolic link that makes files in `storage/app/public` accessible from the web.

### 2. File Structure
Images are stored in:
```
storage/app/public/
├── ads/          # Advertisement images
├── news/         # News article images
├── galleries/    # Gallery media
├── teams/        # Team logos
├── players/      # Player photos
├── referees/     # Referee photos
└── uploads/      # General uploads
```

### 3. API Endpoints

#### Upload Single Image
```
POST /api/upload/image
Content-Type: application/json

{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "folder": "news"  // optional, defaults to "uploads"
}

Response:
{
  "success": true,
  "url": "http://localhost:8000/storage/news/abc123.png",
  "path": "news/abc123.png"
}
```

#### Upload Multiple Images
```
POST /api/upload/images
Content-Type: application/json

{
  "images": ["data:image/png;base64,...", "data:image/jpg;base64,..."],
  "folder": "galleries"
}

Response:
{
  "success": true,
  "images": [
    {"url": "http://localhost:8000/storage/galleries/abc123.png", "path": "galleries/abc123.png"},
    {"url": "http://localhost:8000/storage/galleries/def456.jpg", "path": "galleries/def456.jpg"}
  ],
  "count": 2
}
```

#### Delete Image
```
DELETE /api/upload/image
Content-Type: application/json

{
  "path": "news/abc123.png"
}

Response:
{
  "success": true,
  "message": "Image deleted"
}
```

## Frontend Usage

### ImageUpload Component
The `ImageUpload` component handles both URL input and file uploads:

```jsx
import ImageUpload from "@/components/ui/ImageUpload";

<ImageUpload
  label="Featured Image"
  value={formData.image_url}
  onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
  folder="news"  // Specify the storage folder
/>
```

### Multiple Images
```jsx
<ImageUpload
  label="Gallery Images"
  value={formData.images}
  onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
  folder="galleries"
  multiple={true}
  maxImages={20}
/>
```

### Helper Functions
```javascript
import { uploadImage, uploadMultipleImages, fileToBase64 } from "@/lib/imageUpload";

// Upload single image
const url = await uploadImage(base64Data, "news");

// Upload multiple images
const urls = await uploadMultipleImages([base64Data1, base64Data2], "galleries");

// Convert file to base64
const base64 = await fileToBase64(file);
```

## Database Schema

### Tables with Image Fields

#### news
- `image_url` (string, nullable) - Featured image for news articles

#### ads
- `image_url` (string, required) - Advertisement banner image

#### galleries
- `media_url` (string, required) - Gallery media (image or video)
- `media_type` (enum: 'image', 'video')

#### teams
- `logo_url` (string, nullable) - Team logo

#### players
- `photo_url` (string, nullable) - Player photo

#### referees
- `photo_url` (string, nullable) - Referee photo

## Models with Image Support

All models have been updated to include image fields in their `$fillable` arrays:
- `News`: image_url
- `Ad`: image_url
- `Gallery`: media_url
- `Team`: logo_url
- `Player`: photo_url
- `Referee`: photo_url

## Image Formats Supported
- PNG
- JPG/JPEG
- GIF
- WebP

## File Size Limits
- Maximum file size: 10MB per image
- Recommended: Compress images before upload for better performance

## Security Notes
1. Images are validated on the backend
2. Only image MIME types are accepted
3. Filenames are randomized to prevent conflicts
4. Files are stored outside the public web root (in storage/app/public)
5. Access is controlled through Laravel's storage system

## Troubleshooting

### Images not displaying
1. Make sure you ran `php artisan storage:link`
2. Check file permissions on `storage/app/public`
3. Verify `APP_URL` is set correctly in `.env`

### Upload fails
1. Check PHP `upload_max_filesize` and `post_max_size` in php.ini
2. Verify storage directory is writable
3. Check Laravel logs in `storage/logs/laravel.log`

### CORS issues
If uploading from a different domain, add CORS headers in `config/cors.php`
