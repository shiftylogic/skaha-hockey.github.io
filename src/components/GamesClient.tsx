'use client';

import { useStats } from './StatsProvider';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Calendar, MapPin, Clock } from 'lucide-react';

function formatOpponent(name: string) {
    if (!name) return 'Unknown';
    if (name.startsWith('vs ') || name.startsWith('@')) return name;
    return `vs ${name}`;
}

export function GamesClient() {
  const { filteredGames } = useStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Game Log</h1>
      
      <div className="grid gap-4">
        {filteredGames.length === 0 ? (
           <p className="text-slate-500">No games found matching criteria.</p>
        ) : (
          filteredGames.map(game => (
            <Link 
                key={game.game_id} 
                href={`/games/${game.game_id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Date & Info */}
                <div className="flex-1">
                    <div className="flex items-center text-sm text-slate-500 mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(game.game_date).toLocaleDateString()}
                        <Clock className="w-4 h-4 ml-4 mr-1" />
                        {new Date(game.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {formatOpponent(game.opponent_name)}
                        {game.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded text-xs font-normal bg-slate-100 text-slate-600 border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-sm font-bold text-slate-500 uppercase">SK 12UA2</div>
                        <div className="text-3xl font-mono font-bold text-slate-900">{game.our_score}</div>
                    </div>
                    <div className="text-slate-300 font-light text-2xl">-</div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-slate-500">OPP</div>
                        <div className="text-3xl font-mono font-bold text-slate-900">{game.their_score}</div>
                    </div>
                </div>
                
                {/* Result Indicator */}
                <div className={clsx(
                    "w-full md:w-2 h-2 md:h-12 rounded",
                    game.our_score > game.their_score ? "bg-green-600" : 
                    game.our_score < game.their_score ? "bg-red-600" : "bg-yellow-500"
                )} />

              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}