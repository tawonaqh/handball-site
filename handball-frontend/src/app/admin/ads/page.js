'use client'
import { fetcher } from "@/lib/api";
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default async function AdminAds() {
  const ads = await fetcher('ads');

  async function handleDelete(id) {
    'use client';
    if (!confirm('Are you sure you want to delete this ad?')) return;
    await fetch(`${API_URL}/ads/${id}`, { method: 'DELETE' });
    location.reload();
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Manage Ads</h1>
      <Link href="/admin/ads/create" className="btn btn-primary mb-2">Add New Ad</Link>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Link</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map(a => (
            <tr key={a.id}>
              <td className="border px-2 py-1">{a.title}</td>
              <td className="border px-2 py-1"><a href={a.link} target="_blank" rel="noreferrer">{a.link}</a></td>
              <td className="border px-2 py-1 space-x-2">
                <Link href={`/admin/ads/edit/${a.id}`} className="text-blue-500">Edit</Link>
                <button className="text-red-500" onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}