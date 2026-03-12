import express from 'express';
import matchRouter from './routes/matches.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use('/matches', matchRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Sports API Server Running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});