'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdForm({ ad }) {
  const [title, setTitle] = useState(ad?.title || '');
  const [link, setLink] = useState(ad?.link || '');
  const [imageUrl, setImageUrl] = useState(ad?.image_url || '');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const method = ad ? 'PUT' : 'POST';
    const url = ad ? `http://localhost:8000/api/ads/${ad.id}` : 'http://localhost:8000/api/ads';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link, image_url: imageUrl })
    });

    router.push('/admin/ads');
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{ad ? 'Edit Ad' : 'Create Ad'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label>Link</label>
          <input type="url" value={link} onChange={e => setLink(e.target.value)} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="border rounded px-2 py-1 w-full" />
        </div>
        <button type="submit" className="btn btn-primary">{ad ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}
