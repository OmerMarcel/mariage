// Types principaux de la plateforme mariage

export type MediaType = 'photo' | 'video';

export type MediaStatus = 'en_attente' | 'approuve' | 'refuse' | 'masque';

export type InvitationStatus = 'creee' | 'envoyee' | 'consultee' | 'desactivee';

export type SiteMode = 'public' | 'prive' | 'hybride';

export interface Wedding {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  city: string;
  country: string;
  coverPhotoUrl: string;
  loveMessage: string;
  mode: SiteMode;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverPhotoUrl?: string;
  order: number;
  visible: boolean;
  mediaCount: number;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  categoryId?: string;
  mediaCount: number;
  createdAt: string;
}

export interface Media {
  id: string;
  type: MediaType;
  title?: string;
  originalUrl: string;
  thumbnailUrl: string;
  webUrl: string;
  duration?: number; // for videos, in seconds
  width?: number;
  height?: number;
  size: number; // in bytes
  categoryId?: string;
  albumId?: string;
  uploadedBy?: string; // guest name
  guestMessage?: string;
  status: MediaStatus;
  downloadAllowed: boolean;
  createdAt: string;
  approvedAt?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  group?: string;
  invitationStatus: 'invited' | 'attending' | 'declined' | 'pending';
  uploadAllowed: boolean;
  downloadAllowed: boolean;
  accessCode?: string;
  active: boolean;
  createdAt: string;
}

export interface Invitation {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  invitationText: string;
  program?: string;
  dressCode?: string;
  practicalInfo?: string;
  coverPhotoUrl?: string;
  uniqueLink: string;
  status: InvitationStatus;
  viewCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalPhotos: number;
  totalVideos: number;
  pendingMedias: number;
  totalGuests: number;
  totalAlbums: number;
  totalCategories: number;
  storageUsed: number; // in MB
  recentUploads: Media[];
}
