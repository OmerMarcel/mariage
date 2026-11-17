import 'dotenv/config';
import { getDatabase } from '../src/config/firebase.js';
import {
  albumsData,
  categoriesData,
  coupleStory,
  dashboardStats,
  guestsData,
  invitationData,
  photosData,
  videosData,
  weddingData,
} from '../../client/lib/data/mockData';

type SeedDocument = { id: string; [key: string]: unknown };

async function writeCollection(
  collectionName: string,
  documents: SeedDocument[],
): Promise<void> {
  const database = getDatabase();
  const batch = database.batch();

  for (const document of documents) {
    const { id, ...data } = document;
    batch.set(database.collection(collectionName).doc(id), data);
  }

  await batch.commit();
  console.log(`${collectionName}: ${documents.length} document(s) importé(s).`);
}

async function seed(): Promise<void> {
  const database = getDatabase();
  const { id: _weddingId, ...weddingDocument } = weddingData;

  await database.collection('weddings').doc('main').set(weddingDocument);
  console.log('weddings: 1 document importé.');

  await writeCollection('categories', categoriesData);
  await writeCollection('albums', albumsData);
  await writeCollection('media', [...photosData, ...videosData]);
  await writeCollection('guests', guestsData);

  const { id: _invitationId, ...invitationDocument } = invitationData;
  await database.collection('invitations').doc(invitationData.id).set(invitationDocument);
  await database.collection('settings').doc('dashboardStats').set(dashboardStats);
  await database.collection('settings').doc('coupleStory').set({ entries: coupleStory });
  console.log('invitations et settings: importés.');
}

seed().catch(error => {
  console.error('Échec de l’import Firestore.', error);
  process.exitCode = 1;
});
