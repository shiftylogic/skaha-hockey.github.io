'use client';

import { useState, useMemo } from 'react';
import { useStats } from './StatsProvider';
import { ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';

type SortKey = 'name' | 'gp' | 'goals' | 'assists' | 'points' | 'pim' | 'gpg' | 'apg' | 'ppg';

export function StatsClient() {
  const { playerStats } = useStats();
  const [sortKey, setSortKey] = useState<SortKey>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedStats = useMemo(() => {
    return [...playerStats].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [playerStats, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Player' },
    { key: 'gp', label: 'GP' },
    { key: 'goals', label: 'G' },
    { key: 'assists', label: 'A' },
    { key: 'points', label: 'PTS' },
    { key: 'pim', label: 'PIM' },
    { key: 'gpg', label: 'G/GP' },
    { key: 'apg', label: 'A/GP' },
    { key: 'ppg', label: 'P/GP' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Player Statistics</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 lg:min-w-full min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    scope="col"
                    className={clsx(
                      "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100",
                      h.key === 'name' ? "w-1/3" : ""
                    )}
                    onClick={() => handleSort(h.key)}
                  >
                    <div className="flex items-center gap-1">
                      {h.label}
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedStats.map((p) => (
                <tr key={p.player_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {p.jersey}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.gp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{p.goals}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.assists}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 bg-blue-50">{p.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.pim}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.gpg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.apg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.ppg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
