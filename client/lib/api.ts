import { Category, Media } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const body = await response.json().catch(() => null) as { error?: string; data?: T } | null;

  if (!response.ok) {
    throw new Error(body?.error || `Erreur API (${response.status}).`);
  }

  if (!body || body.data === undefined) {
    throw new Error('Réponse API invalide.');
  }

  return body.data;
}

export function getPublicCategories(): Promise<Category[]> {
  return request<Category[]>('/api/categories');
}

export function getPublicMedia(params: {
  type?: Media['type'];
  categoryId?: string;
} = {}): Promise<Media[]> {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set('type', params.type);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  const query = searchParams.toString();
  return request<Media[]>(`/api/media${query ? `?${query}` : ''}`);
}
