import { Player, Game, Goal, Penalty, TeamPassingStat, GameRoster } from './types';

export interface PlayerStats {
  player_id: number;
  name: string;
  jersey: number;
  position: string;
  gp: number;
  goals: number;
  assists: number;
  points: number;
  pim: number;
  gpg: number; // Goals per game
  apg: number; // Assists per game
  ppg: number; // Points per game
}

export interface TeamStats {
  games_played: number;
  wins: number;
  losses: number;
  ties: number;
  goals_for: number;
  goals_against: number;
  passing_percentage: number;
}

export function calculatePlayerStats(
  roster: Player[],
  games: Game[],
  goals: Goal[],
  penalties: Penalty[],
  gameRoster: GameRoster[]
): PlayerStats[] {
  // Map for O(1) access
  const playerMap = new Map<number, PlayerStats>();

  // Initialize
  roster.forEach(p => {
    playerMap.set(p.player_id, {
      player_id: p.player_id,
      name: p.player_name,
      jersey: p.jersey_number,
      position: p.primary_position,
      gp: 0,
      goals: 0,
      assists: 0,
      points: 0,
      pim: 0,
      gpg: 0,
      apg: 0,
      ppg: 0
    });
  });

  const gameIds = new Set(games.map(g => g.game_id));

  // Calculate GP using Game Roster (excluding scratch)
  gameRoster.forEach(gr => {
    if (gameIds.has(gr.game_id) && gr.position !== 'scratch') {
      const stats = playerMap.get(gr.player_id);
      if (stats) stats.gp++;
    }
  });

  // Goals & Assists
  goals.forEach(g => {
    if (!gameIds.has(g.game_id)) return;

    if (g.scorer_id && playerMap.has(g.scorer_id)) {
      playerMap.get(g.scorer_id)!.goals++;
    }
    if (g.assist1_id && playerMap.has(g.assist1_id)) {
      playerMap.get(g.assist1_id)!.assists++;
    }
    if (g.assist2_id && playerMap.has(g.assist2_id)) {
      playerMap.get(g.assist2_id)!.assists++;
    }
  });

  // PIM
  penalties.forEach(p => {
    if (!gameIds.has(p.game_id)) return;
    if (playerMap.has(p.player_id)) {
      playerMap.get(p.player_id)!.pim += p.penalty_length;
    }
  });

  // Calculate Aggregates
  return Array.from(playerMap.values()).map(p => {
    p.points = p.goals + p.assists;
    p.gpg = p.gp > 0 ? parseFloat((p.goals / p.gp).toFixed(2)) : 0;
    p.apg = p.gp > 0 ? parseFloat((p.assists / p.gp).toFixed(2)) : 0;
    p.ppg = p.gp > 0 ? parseFloat((p.points / p.gp).toFixed(2)) : 0;
    return p;
  });
}

export function calculateTeamStats(games: Game[], passingStats: TeamPassingStat[]): TeamStats {
  let wins = 0;
  let losses = 0;
  let ties = 0;
  let goals_for = 0;
  let goals_against = 0;

  const gameIds = new Set(games.map(g => g.game_id));

  games.forEach(g => {
    goals_for += g.our_score;
    goals_against += g.their_score;
    if (g.our_score > g.their_score) wins++;
    else if (g.our_score < g.their_score) losses++;
    else ties++;
  });

  let totalAttempts = 0;
  let totalCompleted = 0;
  passingStats.forEach(p => {
    if (gameIds.has(p.game_id)) {
      totalAttempts += p.attempts;
      totalCompleted += p.completed;
    }
  });

  return {
    games_played: games.length,
    wins,
    losses,
    ties,
    goals_for,
    goals_against,
    passing_percentage: totalAttempts > 0 ? parseFloat(((totalCompleted / totalAttempts) * 100).toFixed(1)) : 0
  };
}