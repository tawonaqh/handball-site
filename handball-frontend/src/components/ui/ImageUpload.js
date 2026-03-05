"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage, uploadMultipleImages, fileToBase64 } from "@/lib/imageUpload";

export default function ImageUpload({ 
  value = "", 
  onChange, 
  label = "Image",
  multiple = false,
  maxImages = 10,
  className = "",
  folder = "uploads"
}) {
  const [uploadMethod, setUploadMethod] = useState("url");
  const [imageUrl, setImageUrl] = useState(value || "");
  const [imageUrls, setImageUrls] = useState(Array.isArray(value) ? value : []);
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
    if (onChange) onChange(url);
  };

  const handleAddUrl = () => {
    if (imageUrl && !imageUrls.includes(imageUrl)) {
      const newUrls = [...imageUrls, imageUrl];
      setImageUrls(newUrls);
      if (onChange) onChange(newUrls);
      setImageUrl("");
      setPreviewUrl("");
    }
  };

  const handleRemoveUrl = (urlToRemove) => {
    const newUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newUrls);
    if (onChange) onChange(newUrls);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      if (multiple) {
        // Convert all files to base64
        const base64Promises = files.map(file => fileToBase64(file));
        const base64Images = await Promise.all(base64Promises);
        
        // Upload to backend
        const uploadedUrls = await uploadMultipleImages(base64Images, folder);
        
        // Add to existing URLs
        const newUrls = [...imageUrls, ...uploadedUrls].slice(0, maxImages);
        setImageUrls(newUrls);
        if (onChange) onChange(newUrls);
      } else {
        // Single file upload
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const base64 = await fileToBase64(file);
          
          // Upload to backend
          const uploadedUrl = await uploadImage(base64, folder);
          
          setPreviewUrl(uploadedUrl);
          if (onChange) onChange(uploadedUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod("url")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMethod === "url"
              ? "bg-orange-500 text-white"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod("file")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMethod === "file"
              ? "bg-orange-500 text-white"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
        </button>
      </div>

      {uploadMethod === "url" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            {multiple ? (
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
              >
                Add
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleUrlChange(imageUrl)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
              >
                Set
              </button>
            )}
          </div>
        </motion.div>
      )}

      {uploadMethod === "file" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? "border-orange-500 bg-orange-500/10"
              : "border-gray-600/50 bg-gray-700/30 hover:border-gray-500"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-3 animate-spin" />
                <p className="text-gray-300 font-medium mb-1">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB {multiple && `(max ${maxImages} images)`}
                </p>
              </>
            )}
          </label>
        </motion.div>
      )}

      {!multiple && previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50"
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl("");
              setImageUrl("");
              if (onChange) onChange("");
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {multiple && imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {imageUrls.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/50 group"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(url)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {multiple && imageUrls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images added yet</p>
        </div>
      )}
    </div>
  );
}
