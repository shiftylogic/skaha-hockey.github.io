'use client';

import { useMemo, useState, useEffect } from 'react';
import { getGameById, filterStatsByGames } from '@/lib/store';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export function GameDetailClient({ gameId }: { gameId: number }) {
  const game = useMemo(() => getGameById(gameId), [gameId]);
  const stats = useMemo(() => filterStatsByGames([gameId]), [gameId]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!game) return <div>Game not found</div>;

  // Passing Stats by Period (Using Team Stats Table)
  const passesByPeriod = useMemo(() => {
    const data: Record<number, { completed: number; attempts: number; percent: number }> = {};
    stats.team_passing.forEach(p => {
        data[p.period] = {
            completed: p.completed,
            attempts: p.attempts,
            percent: p.attempts > 0 ? parseFloat(((p.completed / p.attempts) * 100).toFixed(1)) : 0
        };
    });
    return data;
  }, [stats.team_passing]);

  const periods = [1, 2, 3, 4].filter(p => passesByPeriod[p] || (p <= 3)); // Always show 1-3

  return (
    <div className="space-y-8">
      <Link href="/games" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Game Log
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-700">
        <div className="p-8 text-center">
            <div className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-4">
                {new Date(game.game_date).toDateString()} • {game.tags.join(', ')}
            </div>
            <div className="flex items-center justify-center gap-12">
                <div className="text-right">
                    <div className="text-3xl font-bold text-slate-900">Jr. Thunderbirds 12U A2</div>
                </div>
                <div className="text-6xl font-black font-mono flex items-center gap-4 bg-slate-100 px-8 py-4 rounded-xl">
                    <span className={game.our_score > game.their_score ? "text-green-700" : "text-slate-800"}>{game.our_score}</span>
                    <span className="text-slate-400">-</span>
                    <span className={game.their_score > game.our_score ? "text-red-700" : "text-slate-800"}>{game.their_score}</span>
                </div>
                <div className="text-left">
                    <div className="text-4xl font-bold text-slate-900">{game.opponent_name}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scoring Summary */}
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Scoring Summary</h2>
            <div className="space-y-4">
                {stats.goals.length === 0 ? <p className="text-slate-500 italic">No goals scored.</p> : (
                    stats.goals.sort((a,b) => (a.period - b.period) || (a.time_seconds - b.time_seconds)).map(goal => (
                        <div key={goal.goal_id} className="flex items-start gap-3">
                            <div className="w-12 text-sm font-mono text-slate-500 pt-1">
                                P{goal.period} {Math.floor(goal.time_seconds / 60)}:{(goal.time_seconds % 60).toString().padStart(2, '0')}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">
                                    {goal.scorer_name}
                                </div>
                                <div className="text-sm text-slate-600">
                                    {goal.assist1_name && `Asst: ${goal.assist1_name}`}
                                    {goal.assist2_name && `, ${goal.assist2_name}`}
                                    {!goal.assist1_name && 'Unassisted'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Penalties */}
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" /> Penalties
            </h2>
            <div className="space-y-3">
                {stats.penalties.length === 0 ? <p className="text-slate-500 italic">No penalties.</p> : (
                    stats.penalties.map(p => (
                        <div key={p.penalty_id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500">P{p.period}</span>
                                <span className="font-semibold text-slate-900">{p.player_name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-700">{p.penalty_name} ({p.penalty_length}m)</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>

      {/* Passing Stats */}
      <div className="bg-white rounded-lg shadow p-6">
         <h2 className="text-lg font-bold text-slate-900 mb-6">Passing Performance</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {periods.map(period => {
                const pStats = passesByPeriod[period];
                if (!pStats || pStats.attempts === 0) return (
                    <div key={period} className="text-center p-4 border rounded-lg bg-slate-50 opacity-50">
                        <div className="font-bold text-slate-500 mb-2">Period {period}</div>
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No Data</div>
                    </div>
                );
                
                const missed = pStats.attempts - pStats.completed;
                const pieData = [
                    { name: 'Completed', value: pStats.completed, color: '#16a34a' },
                    { name: 'Missed', value: missed, color: '#dc2626' }
                ];

                return (
                    <div key={period} className="text-center p-4 border rounded-lg bg-slate-50">
                        <div className="font-bold text-slate-700 mb-2">Period {period}</div>
                        <div className="h-40 relative">
                             {mounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            innerRadius={40} 
                                            outerRadius={60} 
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                             ) : (
                                <div className="w-full h-full bg-slate-50 animate-pulse rounded-full" />
                             )}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-lg font-bold text-slate-900">{pStats.percent}%</span>
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 mt-2 font-medium">
                            {pStats.completed} / {pStats.attempts} Passes
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

    </div>
  );
}