// src/components/PlayerCard.js
import Link from 'next/link';

export default function PlayerCard({ player }) {
  return (
    <Link href={`/viewer/players/${player.id}`}>
      <div className="card hover:shadow-lg p-4 border rounded-md cursor-pointer">
        <h3 className="text-lg font-bold">{player.name}</h3>
        <p>Team: {player.team?.name}</p>
      </div>
    </Link>
  );
}
