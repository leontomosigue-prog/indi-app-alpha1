export type UserType = 'client' | 'employee';

export type Role = 'Vendas' | 'Locação' | 'Assistência Técnica' | 'Peças' | 'Admin';

export type ConversationArea = 'Vendas' | 'Locação' | 'Assistência Técnica' | 'Peças';

export type Priority = 'Preventiva' | 'Urgente' | 'Para Ontem';

export type ConversationStatus = 'open' | 'resolved';

export interface User {
  id: string;
  type: UserType;
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  birthDate?: string;
  cpf?: string;
  companyName?: string;
  cnpj?: string;
  roles?: Role[];
  lgpdAccepted: boolean;
  biometricEnabled: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: UserType;
  content: string;
  attachments?: string[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  area: ConversationArea;
  reason: string;
  status: ConversationStatus;
  priority?: Priority;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  messages: Message[];
  createdAt: string;
  resolvedAt?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: ConversationArea;
  imageUrl?: string;
  specifications?: Record<string, string>;
  price?: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'warning' | 'maintenance' | 'promotion';
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
  isActive: boolean;
}
