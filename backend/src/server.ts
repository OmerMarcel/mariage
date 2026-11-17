import 'dotenv/config';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import { getApps } from 'firebase-admin/app';
import { getDatabase } from './config/firebase.js';
import { adminRouter } from './routes/admin.js';
import { publicRouter } from './routes/public.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = [process.env.CLIENT_ORIGIN, process.env.ADMIN_ORIGIN].filter(
  (origin): origin is string => Boolean(origin),
);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : false,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    firebaseConfigured: getApps().length > 0,
  });
});

app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError) {
    response.status(400).json({ error: 'JSON invalide.' });
    return;
  }

  if (error instanceof Error && error.name === 'ZodError') {
    response.status(400).json({ error: 'Données invalides.', details: error });
    return;
  }

  console.error(error);
  response.status(500).json({ error: 'Une erreur serveur est survenue.' });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend mariage démarré sur http://localhost:${port}`);
});
