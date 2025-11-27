'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryForm({ item }) {
  const [title, setTitle] = useState(item?.title || '');
  const [mediaType, setMediaType] = useState(item?.media_type || 'image');
  const [mediaUrl, setMediaUrl] = useState(item?.media_url || '');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const method = item ? 'PUT' : 'POST';
    const url = item ? `http://localhost:8000/api/gallery/${item.id}` : 'http://localhost:8000/api/gallery';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, media_type: mediaType, media_url: mediaUrl })
    });

    router.push('/admin/gallery');
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{item ? 'Edit Gallery Item' : 'Create Gallery Item'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label>Media Type</label>
          <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="border rounded px-2 py-1 w-full" required>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label>Media URL</label>
          <input type="text" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <button type="submit" className="btn btn-primary">{item ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}
