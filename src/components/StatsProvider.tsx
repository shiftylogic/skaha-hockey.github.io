'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { getAllGames, filterStatsByGames, getRoster, getAllTags, getGoals, getPenalties, getTeamPassingStats, getGameRoster } from '@/lib/store';
import { PlayerStats, TeamStats, calculatePlayerStats, calculateTeamStats } from '@/lib/stats-utils';
import { Game } from '@/lib/types';

interface Filters {
  startDate: string | null; // ISO Date string YYYY-MM-DD
  endDate: string | null;
  tags: string[];
}

interface StatsContextType {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredGames: Game[];
  playerStats: PlayerStats[];
  teamStats: TeamStats;
  allTags: string[];
  resetFilters: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    tags: []
  });

  const allGames = useMemo(() => getAllGames(), []);
  const allTags = useMemo(() => getAllTags(), []);
  
  // Data sources
  const roster = useMemo(() => getRoster(), []);

  const filteredGames = useMemo(() => {
    return allGames.filter(g => {
      // Date Filter
      if (filters.startDate && filters.endDate) {
        const gDate = new Date(g.game_date);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        // Set end date to end of day
        end.setHours(23, 59, 59, 999);
        
        if (gDate < start || gDate > end) return false;
      }

      // Tag Filter
      if (filters.tags.length > 0) {
        const gameTags = new Set(g.tags);
        const hasMatch = filters.tags.some(t => gameTags.has(t));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [allGames, filters]);

  const { playerStats, teamStats } = useMemo(() => {
    const gameIds = filteredGames.map(g => g.game_id);
    const filteredData = filterStatsByGames(gameIds);
    
    const pStats = calculatePlayerStats(
        roster, 
        filteredGames, 
        filteredData.goals, 
        filteredData.penalties,
        filteredData.game_roster
    );
    
    const tStats = calculateTeamStats(filteredGames, filteredData.team_passing);

    return { playerStats: pStats, teamStats: tStats };
  }, [filteredGames, roster]);

  const resetFilters = () => setFilters({ startDate: null, endDate: null, tags: [] });

  return (
    <StatsContext.Provider value={{ 
      filters, 
      setFilters, 
      filteredGames, 
      playerStats, 
      teamStats, 
      allTags,
      resetFilters
    }}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};