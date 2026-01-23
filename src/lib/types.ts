export interface Game {
  game_id: number;
  game_date: string;
  game_time_minutes: number;
  period1_length: number;
  period1_clock_type: string;
  period2_length: number;
  period2_clock_type: string;
  period3_length: number;
  period3_clock_type: string;
  period4_length: number | null;
  period4_clock_type: string | null;
  has_shootout: number;
  our_score: number;
  their_score: number;
  opponent_name: string;
  tags: string[];
}

export interface Player {
  player_id: number;
  jersey_number: number;
  player_name: string;
  primary_position: string;
  secondary_positions: string | null;
  birth_year: number;
  handedness: string;
}

export interface Goal {
  goal_id: number;
  game_id: number;
  period: number;
  time_seconds: number;
  scorer_id: number;
  assist1_id: number | null;
  assist2_id: number | null;
  goal_type: string;
  empty_net: number;
  scorer_name: string;
  assist1_name?: string;
  assist2_name?: string;
}

export interface Penalty {
  penalty_id: number;
  game_id: number;
  period: number;
  time_seconds: number;
  player_id: number;
  penalty_type_id: number;
  penalty_name: string;
  penalty_category: string;
  penalty_length: number;
  player_name: string;
}

export interface TeamPassingStat {
  game_id: number;
  period: number;
  attempts: number;
  completed: number;
}

export interface GameRoster {
  game_id: number;
  player_id: number;
  position: string;
  code: string;
  note: string | null;
}

export interface Shot {
  shot_id: number;
  game_id: number;
  period: number;
  time_seconds: number;
  player_id: number;
  result: string;
  origin_zone: number;
  player_name: string;
}

export interface GoalAgainst {
  goal_id: number;
  game_id: number;
  period: number;
  time_seconds: number;
  goal_type: string;
}

export interface HockeyData {
  metadata: { generated_at: string };
  games: Game[];
  roster: Player[];
  goals: Goal[];
  penalties: Penalty[];
  team_passing: TeamPassingStat[];
  game_roster: GameRoster[];
  shots: Shot[];
  goals_against: GoalAgainst[];
}