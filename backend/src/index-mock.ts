import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Mock routes for testing without Prisma
app.get('/api/dumps', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.post('/api/dumps', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'mock-id-123',
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      urgency: req.body.urgency,
      appearance: req.body.appearance,
      environmentType: req.body.environmentType,
      weight: 5.2,
      status: 'ACTIVE',
      reportsCount: 1,
      municipalityId: 'mock-municipality',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});

app.get('/api/municipalities', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'mock-beograd',
        name: 'Beograd',
        email: 'komunalne@beograd.rs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mock-novi-sad',
        name: 'Novi Sad',
        email: 'komunalne@novisad.rs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});