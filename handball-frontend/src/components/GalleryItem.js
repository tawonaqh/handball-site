// src/components/GalleryItem.js
export default function GalleryItem({ item }) {
  return (
    <div className="card p-2 border rounded-md mb-2">
      {item.media_type === 'image' ? (
        <img src={item.media_url} alt={item.title} className="w-full h-48 object-cover rounded-md" />
      ) : (
        <video controls className="w-full h-48 rounded-md">
          <source src={item.media_url} type="video/mp4" />
        </video>
      )}
      <p className="mt-2 font-semibold">{item.title}</p>
    </div>
  );
}
