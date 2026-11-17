import { Router } from 'express';
import { getDatabase } from '../config/firebase.js';
import { Category, Media, Wedding } from '../types.js';

export const publicRouter = Router();

publicRouter.get('/wedding', async (_request, response, next) => {
  try {
    const snapshot = await getDatabase().collection('weddings').doc('main').get();

    if (!snapshot.exists) {
      response.status(404).json({ error: 'Informations du mariage introuvables.' });
      return;
    }

    const data = { id: snapshot.id, ...snapshot.data() } as Wedding;
    response.json({ data });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/categories', async (_request, response, next) => {
  try {
    const snapshot = await getDatabase()
      .collection('categories')
      .where('visible', '==', true)
      .orderBy('order')
      .get();
    const data = snapshot.docs.map(document => ({
      id: document.id,
      ...document.data(),
    })) as Category[];

    response.json({ data });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/media', async (request, response, next) => {
  try {
    const type = request.query.type;
    const categoryId = request.query.categoryId;
    let query = getDatabase()
      .collection('media')
      .where('status', '==', 'approuve')
      .orderBy('createdAt', 'desc');

    if (type === 'photo' || type === 'video') {
      query = query.where('type', '==', type);
    }
    if (typeof categoryId === 'string' && categoryId.length > 0) {
      query = query.where('categoryId', '==', categoryId);
    }

    const snapshot = await query.limit(100).get();
    const data = snapshot.docs.map(document => ({
      id: document.id,
      ...document.data(),
    })) as Media[];

    response.json({ data });
  } catch (error) {
    next(error);
  }
});
