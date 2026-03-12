import express from 'express';
import matchRouter from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import http from 'http';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json());

// Routes
app.use('/matches', matchRouter);
const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Sports API Server Running' });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});