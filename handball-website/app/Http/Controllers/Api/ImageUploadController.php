<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    /**
     * Upload an image and return the URL
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // base64 encoded image
            'folder' => 'nullable|string' // optional folder name (ads, news, teams, etc.)
        ]);

        try {
            $imageData = $request->input('image');
            $folder = $request->input('folder', 'uploads');

            // Check if it's a base64 image
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                // Extract the base64 encoded text
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif

                // Decode base64
                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json(['error' => 'Base64 decode failed'], 400);
                }

                // Generate unique filename
                $filename = Str::random(40) . '.' . $type;
                $path = $folder . '/' . $filename;

                // Store in public disk
                Storage::disk('public')->put($path, $imageData);

                // Return the URL
                $url = Storage::disk('public')->url($path);

                return response()->json([
                    'success' => true,
                    'url' => $url,
                    'path' => $path
                ], 201);
            }

            // If it's already a URL, just return it
            if (filter_var($imageData, FILTER_VALIDATE_URL)) {
                return response()->json([
                    'success' => true,
                    'url' => $imageData,
                    'path' => null
                ], 200);
            }

            return response()->json(['error' => 'Invalid image format'], 400);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Image upload failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple images
     */
    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|string',
            'folder' => 'nullable|string'
        ]);

        $folder = $request->input('folder', 'uploads');
        $uploadedImages = [];

        foreach ($request->input('images') as $imageData) {
            try {
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $type = strtolower($type[1]);
                    $imageData = base64_decode($imageData);

                    if ($imageData === false) {
                        continue;
                    }

                    $filename = Str::random(40) . '.' . $type;
                    $path = $folder . '/' . $filename;

                    Storage::disk('public')->put($path, $imageData);
                    $url = Storage::disk('public')->url($path);

                    $uploadedImages[] = [
                        'url' => $url,
                        'path' => $path
                    ];
                } elseif (filter_var($imageData, FILTER_VALIDATE_URL)) {
                    $uploadedImages[] = [
                        'url' => $imageData,
                        'path' => null
                    ];
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return response()->json([
            'success' => true,
            'images' => $uploadedImages,
            'count' => count($uploadedImages)
        ], 201);
    }

    /**
     * Delete an image
     */
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            $path = $request->input('path');
            
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                return response()->json(['success' => true, 'message' => 'Image deleted'], 200);
            }

            return response()->json(['error' => 'Image not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Delete failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
