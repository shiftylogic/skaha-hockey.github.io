import rawData from '@/data/hockey-data.json';
import { HockeyData, Game, Player, Goal, Penalty, TeamPassingStat, GameRoster, Shot, GoalAgainst } from './types';

// Cast the raw json to our typed interface
const data = rawData as unknown as HockeyData;

export const getRoster = (): Player[] => {
  return data.roster;
};

export const getAllGames = (): Game[] => {
  return data.games.sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime());
};

export const getGameById = (id: number): Game | undefined => {
  return data.games.find(g => g.game_id === id);
};

export const getGoals = (): Goal[] => data.goals;
export const getPenalties = (): Penalty[] => data.penalties;
export const getTeamPassingStats = (): TeamPassingStat[] => data.team_passing;
export const getGameRoster = (): GameRoster[] => data.game_roster;
export const getShots = (): Shot[] => data.shots;
export const getGoalsAgainst = (): GoalAgainst[] => data.goals_against;

// Helper to filter everything by a list of game IDs
export const filterStatsByGames = (gameIds: number[]) => {
  const set = new Set(gameIds);
  return {
    goals: data.goals.filter(g => set.has(g.game_id)),
    penalties: data.penalties.filter(p => set.has(p.game_id)),
    team_passing: data.team_passing.filter(p => set.has(p.game_id)),
    game_roster: data.game_roster.filter(r => set.has(r.game_id)),
    shots: data.shots.filter(s => set.has(s.game_id)),
    goals_against: data.goals_against.filter(g => set.has(g.game_id)),
  };
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  data.games.forEach(g => {
    g.tags.forEach(t => tags.add(t));
  });
  return Array.from(tags).sort();
};