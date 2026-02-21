'use client';

import { useParams } from 'next/navigation';
import LiveMatchViewer from '@/components/LiveMatchViewer';

export default function PublicLiveMatchPage() {
  const params = useParams();
  const gameId = params.id;

  return (
    <div className="min-h-screen">
      <LiveMatchViewer gameId={gameId} />
    </div>
  );
}
