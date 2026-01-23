import { getAllGames } from '@/lib/store';
import { GameDetailClient } from '@/components/GameDetailClient';

export function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    id: game.game_id.toString(),
  }));
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameDetailClient gameId={parseInt(id)} />;
}
