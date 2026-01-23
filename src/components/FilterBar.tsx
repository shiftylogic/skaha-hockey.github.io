'use client';

import { useStats } from './StatsProvider';
import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

export function FilterBar() {
  const { filters, setFilters, allTags, resetFilters } = useStats();

  const toggleTag = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const hasFilters = filters.tags.length > 0 || filters.startDate || filters.endDate;

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-slate-500 mr-2">
            <Filter className="w-4 h-4 mr-1" />
            <span className="text-sm font-semibold">Filters:</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  filters.tags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range (Simple Implementation) */}
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            className="border border-slate-300 rounded px-2 py-1 text-slate-700"
            value={filters.startDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || null }))}
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            className="border border-slate-300 rounded px-2 py-1 text-slate-700"
            value={filters.endDate || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || null }))}
          />
          
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="ml-2 flex items-center text-red-500 hover:text-red-700 text-xs font-medium"
            >
              <X className="w-3 h-3 mr-1" />
              Reset
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
