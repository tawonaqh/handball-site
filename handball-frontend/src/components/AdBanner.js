// src/components/AdBanner.js
export default function AdBanner({ ad }) {
  return (
    <a href={ad.link || '#'} target="_blank" rel="noopener noreferrer">
      <div className="card p-2 border rounded-md mb-2 hover:shadow-md">
        <img src={ad.image_url} alt={ad.title} className="w-full h-40 object-cover rounded-md" />
        <p className="text-center font-semibold mt-2">{ad.title}</p>
      </div>
    </a>
  );
}
