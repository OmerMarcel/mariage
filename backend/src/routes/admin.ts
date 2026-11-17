import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getDatabase } from '../config/firebase.js';
import { requireAdmin } from '../middleware/auth.js';

const statusSchema = z.object({
  status: z.enum(['en_attente', 'approuve', 'refuse', 'masque']),
});

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get('/media', async (request, response, next) => {
  try {
    const status = request.query.status;
    const snapshot = status
      ? await getDatabase().collection('media').where('status', '==', status).limit(100).get()
      : await getDatabase().collection('media').limit(100).get();

    response.json({
      data: snapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
      })),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/media/:id/status', async (request, response, next) => {
  try {
    const { status } = statusSchema.parse(request.body);
    const mediaReference = getDatabase().collection('media').doc(request.params.id);
    const mediaSnapshot = await mediaReference.get();

    if (!mediaSnapshot.exists) {
      response.status(404).json({ error: 'Média introuvable.' });
      return;
    }

    const update: Record<string, unknown> = { status };
    if (status === 'approuve') {
      update.approvedAt = FieldValue.serverTimestamp();
    }

    await mediaReference.update(update);
    const updatedSnapshot = await mediaReference.get();
    response.json({ data: { id: updatedSnapshot.id, ...updatedSnapshot.data() } });
  } catch (error) {
    next(error);
  }
});
