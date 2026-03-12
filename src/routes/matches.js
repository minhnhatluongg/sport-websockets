import express from 'express';
import { eq,desc } from 'drizzle-orm';
import { db } from '../db/db.js';
import { matches } from '../db/schema.js';
import { createMatchSchema, updateScoreSchema, listMatchesQuerySchema } from '../validation/matches.js';

const router = express.Router();

// GET all matches
router.get('/', async (req, res) => {
  try {
    const queryData = listMatchesQuerySchema.parse(req.query);
    let query = db.select().from(matches).orderBy((desc(matches.createdAt))).limit(100);
    
    if (queryData.limit) {
      query = query.limit(queryData.limit);
    }
    
    const allMatches = await query;
    res.json(allMatches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET match by ID
router.get('/:id', async (req, res) => {
  try {
    const matchId = parseInt(req.params.id, 10);
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }
    
    const match = await db.select().from(matches).where(eq(matches.id, matchId));
    
    if (match.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(match[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new match
router.post('/', async (req, res) => {
  try {
    const validatedData = createMatchSchema.parse(req.body);
    
    const newMatch = await db.insert(matches).values({
      sport: validatedData.sport,
      homeTeam: validatedData.homeTeam,
      awayTeam: validatedData.awayTeam,
      startTime: new Date(validatedData.startTime),
      endTime: validatedData.endTime ? new Date(validatedData.endTime) : null,
      homeScore: validatedData.homeScore || 0,
      awayScore: validatedData.awayScore || 0,
    }).returning();
    

    if(res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(newMatch[0]);
    }


    res.status(201).json(newMatch[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update match score
router.put('/:id/score', async (req, res) => {
  try {
    const matchId = parseInt(req.params.id, 10);
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }
    
    const validatedData = updateScoreSchema.parse(req.body);
    
    const updatedMatch = await db
      .update(matches)
      .set({
        homeScore: validatedData.homeScore,
        awayScore: validatedData.awayScore,
      })
      .where(eq(matches.id, matchId))
      .returning();
    
    if (updatedMatch.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json(updatedMatch[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;