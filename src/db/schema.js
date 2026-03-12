import { pgTable, serial, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Define the match_status enum
export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// Matches table - stores sports match information
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Commentary table - stores real-time match commentary and events
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minutes: integer('minutes').notNull(),
  sequence: integer('sequence').notNull(),
  period: text('period').notNull(),
  eventType: text('event_type').notNull(),
  actor: text('actor').notNull(),
  team: text('team').notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for type-safe queries (optional for JS, useful for JSDoc)
export const matchTypes = {
  // Match type descriptors for documentation
};

export const commentaryTypes = {
  // Commentary type descriptors for documentation
};
