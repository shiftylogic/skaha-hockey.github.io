'use client';

import { useState, useEffect } from 'react';
import { useStats } from './StatsProvider';
import { PostData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowRight, Trophy, Target, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function formatOpponent(name: string) {
    if (!name) return 'Unknown';
    if (name.startsWith('vs ') || name.startsWith('@')) return name;
    return `vs ${name}`;
}

export function DashboardClient({ latestPost }: { latestPost?: PostData }) {
  const { teamStats, playerStats, filteredGames } = useStats();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Top Players
  const topPoints = [...playerStats].sort((a, b) => b.points - a.points).slice(0, 5);
  
  // Recent Games (from filtered set)
  const recentGames = filteredGames.slice(0, 3);

  // Win Rate
  const winRate = teamStats.games_played > 0 
    ? ((teamStats.wins / teamStats.games_played) * 100).toFixed(0) 
    : '0';

  return (
    <div className="space-y-8">
      
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            label="Record (W-L-T)" 
            value={`${teamStats.wins}-${teamStats.losses}-${teamStats.ties}`} 
            sub={`Win Rate: ${winRate}%`}
            borderClass="border-blue-700"
        />
        <StatCard 
            label="Goals For / Against" 
            value={`${teamStats.goals_for} / ${teamStats.goals_against}`} 
            sub={`Diff: ${teamStats.goals_for - teamStats.goals_against}`}
            borderClass="border-green-700"
        />
        <StatCard 
            label="Passing Efficiency" 
            value={`${teamStats.passing_percentage}%`} 
            sub="Season Average"
            borderClass="border-indigo-700"
        />
        <StatCard 
            label="Games Played" 
            value={teamStats.games_played.toString()} 
            sub="Filtered Selection"
            borderClass="border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Recent Games & Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Games */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Games
            </h2>
            <div className="space-y-4">
              {recentGames.length === 0 ? (
                <p className="text-slate-500 italic">No games match the current filters.</p>
              ) : (
                recentGames.map(game => (
                  <div key={game.game_id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={clsx(
                                "w-2 h-12 rounded-full",
                                game.our_score > game.their_score ? "bg-green-600" : 
                                game.our_score < game.their_score ? "bg-red-600" : "bg-yellow-500"
                            )} />
                            <div>
                                <div className="text-sm text-slate-500">{new Date(game.game_date).toLocaleDateString()}</div>
                                <div className="font-semibold text-slate-900">{formatOpponent(game.opponent_name)}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold font-mono text-slate-800">
                                {game.our_score} - {game.their_score}
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                {game.tags[0]}
                            </div>
                        </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredGames.length > 0 && (
                <div className="mt-4 text-right">
                    <Link href="/games" className="text-sm text-blue-700 hover:text-blue-900 font-medium inline-flex items-center">
                        View All Games <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            )}
          </div>

            {/* Goals Graph */}
            <div className="bg-white rounded-lg shadow p-6 h-80">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Goals Trend</h2>
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...filteredGames].slice(0, 10).reverse()}>
                          <XAxis dataKey="opponent_name" tick={false} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="our_score" fill="#2563eb" name="Us" />
                          <Bar dataKey="their_score" fill="#dc2626" name="Them" />
                      </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded" />
                )}
            </div>

        </div>

        {/* Sidebar: Leaders & Coach */}
        <div className="space-y-8">
            
            {/* Top Scorers */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                    Points Leaders
                </h2>
                <div className="space-y-3">
                    {topPoints.map((p, i) => (
                        <div key={p.player_id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                                    i === 0 ? "bg-yellow-100 text-yellow-800" :
                                    i === 1 ? "bg-slate-200 text-slate-800" :
                                    i === 2 ? "bg-orange-100 text-orange-800" : "text-slate-500"
                                )}>{i + 1}</span>
                                <div>
                                    <div className="font-medium text-slate-900">{p.name}</div>
                                    <div className="text-xs text-slate-500">#{p.jersey} • {p.position}</div>
                                </div>
                            </div>
                            <div className="font-bold text-slate-900">{p.points} <span className="text-xs font-normal text-slate-500">pts</span></div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <Link href="/stats" className="text-sm text-blue-700 hover:text-blue-900 font-medium">
                        Full Roster Stats
                    </Link>
                </div>
            </div>

            {/* Latest Update */}
            {latestPost && (
                <div className="bg-slate-900 rounded-lg shadow-lg p-6 text-white border border-slate-700">
                    <h2 className="text-lg font-bold mb-2 flex items-center text-white">
                        <Target className="w-5 h-5 mr-2 text-blue-400" />
                        Coach's Corner
                    </h2>
                    <h3 className="font-semibold text-lg text-blue-200 mb-2">{latestPost.title}</h3>
                    <div className="text-slate-300 text-sm mb-4 line-clamp-3">
                        {latestPost.excerpt || "Check out the latest update from the coaching staff."}
                    </div>
                    <Link href={`/posts/${latestPost.slug}`} className="text-sm font-medium text-white border border-white/20 hover:bg-white/10 px-4 py-2 rounded inline-block transition-colors">
                        Read More
                    </Link>
                </div>
            )}

        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, sub, borderClass }: { label: string, value: string, sub: string, borderClass: string }) {
    return (
        <div className={clsx("bg-white rounded-lg shadow p-6 border-l-4", borderClass)}>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
            <div className="mt-1 text-xs text-slate-500">{sub}</div>
        </div>
    )
}
