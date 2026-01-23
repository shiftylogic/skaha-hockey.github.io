const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../stats.db');
const outputPath = path.resolve(__dirname, '../src/data/hockey-data.json');

console.log(`Reading database from ${dbPath}`);

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found!');
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

// Helpers
const getAll = (query, params = []) => db.prepare(query).all(params);

// 1. Get Games with Tags
const games = getAll(`
  SELECT 
    g.*,
    GROUP_CONCAT(gt.tag_name) as tags
  FROM games g
  LEFT JOIN game_tag_mapping gtm ON g.game_id = gtm.game_id
  LEFT JOIN game_tags gt ON gtm.tag_id = gt.tag_id
  GROUP BY g.game_id
  ORDER BY g.game_date DESC
`);

// Process tags into array
games.forEach(g => {
  g.tags = g.tags ? g.tags.split(',') : [];
});

// 2. Get Roster
const roster = getAll(`SELECT * FROM roster ORDER BY jersey_number`);

// 3. Get Goals (Points)
const goals = getAll(`
  SELECT 
    gf.*,
    scorer.player_name as scorer_name,
    a1.player_name as assist1_name,
    a2.player_name as assist2_name
  FROM goals_for gf
  LEFT JOIN roster scorer ON gf.scorer_id = scorer.player_id
  LEFT JOIN roster a1 ON gf.assist1_id = a1.player_id
  LEFT JOIN roster a2 ON gf.assist2_id = a2.player_id
`);

// 4. Get Penalties
const penalties = getAll(`
  SELECT 
    p.*,
    pt.penalty_name,
    pt.penalty_category,
    pt.penalty_length,
    r.player_name
  FROM penalties p
  JOIN penalty_types pt ON p.penalty_type_id = pt.penalty_type_id
  JOIN roster r ON p.player_id = r.player_id
`);

// 5. Get Team Passing Stats
const team_passing = getAll(`SELECT * FROM team_passing_stats`);

// 6. Get Game Roster (for Attendance/GP)
const game_roster = getAll(`SELECT * FROM game_roster`);

// 7. Get Shots (for completeness)
const shots = getAll(`
  SELECT 
    s.*,
    r.player_name
  FROM shots s
  JOIN roster r ON s.player_id = r.player_id
`);

// 8. Goals Against (for timelines)
const goals_against = getAll(`SELECT * FROM goals_against`);

const data = {
  metadata: {
    generated_at: new Date().toISOString(),
  },
  games,
  roster,
  goals,
  penalties,
  team_passing,
  game_roster,
  shots,
  goals_against
};

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Data successfully written to ${outputPath}`);
