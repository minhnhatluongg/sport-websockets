import express from 'express';
const app = express();
const PORT = 8080;

// Use JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express server!' });
});

// Start server and log URL
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});