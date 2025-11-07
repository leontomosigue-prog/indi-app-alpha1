import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Announcement, CatalogItem, Conversation, ConversationArea, Message, Priority } from '@/types';
import { useAuth } from './AuthContext';

const STORAGE_KEYS = {
  CONVERSATIONS: '@indi:conversations',
  CATALOG: '@indi:catalog',
  ANNOUNCEMENTS: '@indi:announcements',
};

const MOCK_CATALOG: CatalogItem[] = [
  {
    id: '1',
    name: 'Empilhadeira Elétrica 2T',
    description: 'Empilhadeira elétrica com capacidade de 2 toneladas, ideal para armazéns fechados',
    category: 'Vendas',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    specifications: {
      'Capacidade': '2000 kg',
      'Altura máxima': '4.5m',
      'Tipo': 'Elétrica',
    },
    price: 85000,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Empilhadeira a Gás 3T',
    description: 'Empilhadeira a gás GLP com capacidade de 3 toneladas',
    category: 'Locação',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
    specifications: {
      'Capacidade': '3000 kg',
      'Altura máxima': '5m',
      'Tipo': 'Gás GLP',
    },
    price: 1200,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Bem-vindo ao INDI',
    content: 'Seja bem-vindo ao nosso sistema de atendimento. Aqui você pode entrar em contato com todos os departamentos e acompanhar suas solicitações.',
    type: 'news',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    createdAt: new Date().toISOString(),
    createdBy: 'Admin',
    isActive: true,
  },
  {
    id: '2',
    title: 'Manutenção Programada',
    content: 'Informamos que haverá manutenção em nossos sistemas no dia 15/06 das 22h às 2h. Durante este período, alguns serviços podem ficar indisponíveis.',
    type: 'maintenance',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Admin',
    isActive: true,
  },
  {
    id: '3',
    title: 'Promoção de Locação',
    content: 'Aproveite! 20% de desconto na locação de empilhadeiras para contratos acima de 6 meses. Válido até 30/06.',
    type: 'promotion',
    imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: 'Admin',
    expiresAt: new Date(Date.now() + 2592000000).toISOString(),
    isActive: true,
  },
];

export const [DataProvider, useData] = createContextHook(() => {
  const authContext = useAuth();
  const user = authContext?.user || null;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearAllData = useCallback(async () => {
    console.log('DataContext: Limpando todos os dados...');
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
      await AsyncStorage.removeItem(STORAGE_KEYS.CATALOG);
      await AsyncStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
      setConversations([]);
      setCatalog([]);
      setAnnouncements([]);
      console.log('DataContext: Todos os dados foram limpos');
    } catch (error) {
      console.error('DataContext: Erro ao limpar dados:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    console.log('DataContext: Loading data...');
    try {
      const storedConversations = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const storedCatalog = await AsyncStorage.getItem(STORAGE_KEYS.CATALOG);
      const storedAnnouncements = await AsyncStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);

      if (storedConversations) {
        console.log('DataContext: Loaded stored conversations');
        setConversations(JSON.parse(storedConversations));
      } else {
        console.log('DataContext: No stored conversations');
      }

      if (storedCatalog) {
        console.log('DataContext: Loaded stored catalog');
        setCatalog(JSON.parse(storedCatalog));
      } else {
        console.log('DataContext: Initializing default catalog');
        await AsyncStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(MOCK_CATALOG));
        setCatalog(MOCK_CATALOG);
      }

      if (storedAnnouncements) {
        console.log('DataContext: Loaded stored announcements');
        setAnnouncements(JSON.parse(storedAnnouncements));
      } else {
        console.log('DataContext: Initializing default announcements');
        await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(MOCK_ANNOUNCEMENTS));
        setAnnouncements(MOCK_ANNOUNCEMENTS);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      console.log('DataContext: Data loading complete');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('DataContext: User changed', user ? 'User exists' : 'No user');
    if (user) {
      loadData();
    } else {
      clearAllData();
      setIsLoading(false);
    }
  }, [user, loadData, clearAllData]);

  const saveConversations = useCallback(async (updatedConversations: Conversation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }, []);

  const saveCatalog = useCallback(async (updatedCatalog: CatalogItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(updatedCatalog));
      setCatalog(updatedCatalog);
    } catch (error) {
      console.error('Error saving catalog:', error);
    }
  }, []);

  const createConversation = useCallback(async (
    area: ConversationArea,
    reason: string,
    priority?: Priority,
    attachments?: string[],
    location?: { latitude: number; longitude: number; address?: string }
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const newConversation: Conversation = {
      id: Date.now().toString(),
      clientId: user.id,
      clientName: user.fullName,
      area,
      reason,
      status: 'open',
      priority,
      messages: [],
      createdAt: new Date().toISOString(),
      location,
    };

    const initialMessage: Message = {
      id: `${newConversation.id}-1`,
      conversationId: newConversation.id,
      senderId: user.id,
      senderName: user.fullName,
      senderType: user.type,
      content: reason,
      attachments,
      timestamp: new Date().toISOString(),
    };

    newConversation.messages.push(initialMessage);

    const updated = [newConversation, ...conversations];
    await saveConversations(updated);

    return newConversation.id;
  }, [user, conversations, saveConversations]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    attachments?: string[]
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const newMessage: Message = {
      id: `${conversationId}-${Date.now()}`,
      conversationId,
      senderId: user.id,
      senderName: user.fullName,
      senderType: user.type,
      content,
      attachments,
      timestamp: new Date().toISOString(),
    };

    const updated = conversations.map(c =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, newMessage] }
        : c
    );

    await saveConversations(updated);
  }, [user, conversations, saveConversations]);

  const resolveConversation = useCallback(async (conversationId: string): Promise<void> => {
    const updated = conversations.map(c =>
      c.id === conversationId
        ? { ...c, status: 'resolved' as const, resolvedAt: new Date().toISOString() }
        : c
    );
    await saveConversations(updated);
  }, [conversations, saveConversations]);

  const setPriority = useCallback(async (conversationId: string, priority: Priority): Promise<void> => {
    const updated = conversations.map(c =>
      c.id === conversationId ? { ...c, priority } : c
    );
    await saveConversations(updated);
  }, [conversations, saveConversations]);

  const addCatalogItem = useCallback(async (item: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    const newItem: CatalogItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCatalog([...catalog, newItem]);
  }, [catalog, saveCatalog]);

  const updateCatalogItem = useCallback(async (id: string, updates: Partial<CatalogItem>): Promise<void> => {
    const updated = catalog.map(item =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    );
    await saveCatalog(updated);
  }, [catalog, saveCatalog]);

  const deleteCatalogItem = useCallback(async (id: string): Promise<void> => {
    const updated = catalog.filter(item => item.id !== id);
    await saveCatalog(updated);
  }, [catalog, saveCatalog]);

  const filteredConversations = useMemo(() => {
    if (!user) return [];

    if (user.type === 'client') {
      return conversations.filter(c => c.clientId === user.id);
    }

    if (user.roles?.includes('Admin')) {
      return conversations;
    }

    return conversations.filter(c =>
      user.roles?.some(role => role === c.area)
    );
  }, [conversations, user]);

  const catalogByArea = useCallback((area: ConversationArea) => {
    return catalog.filter(item => item.category === area && item.available);
  }, [catalog]);

  const saveAnnouncements = useCallback(async (updatedAnnouncements: Announcement[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updatedAnnouncements));
      setAnnouncements(updatedAnnouncements);
    } catch (error) {
      console.error('Error saving announcements:', error);
    }
  }, []);

  const addAnnouncement = useCallback(async (announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    await saveAnnouncements([newAnnouncement, ...announcements]);
  }, [user, announcements, saveAnnouncements]);

  const updateAnnouncement = useCallback(async (id: string, updates: Partial<Announcement>): Promise<void> => {
    const updated = announcements.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    await saveAnnouncements(updated);
  }, [announcements, saveAnnouncements]);

  const deleteAnnouncement = useCallback(async (id: string): Promise<void> => {
    const updated = announcements.filter(item => item.id !== id);
    await saveAnnouncements(updated);
  }, [announcements, saveAnnouncements]);

  const activeAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements
      .filter(a => {
        if (!a.isActive) return false;
        if (!a.expiresAt) return true;
        return new Date(a.expiresAt) > now;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [announcements]);

  return useMemo(() => ({
    conversations: filteredConversations,
    catalog,
    announcements: activeAnnouncements,
    isLoading,
    createConversation,
    sendMessage,
    resolveConversation,
    setPriority,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    catalogByArea,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    clearAllData,
  }), [
    filteredConversations,
    catalog,
    activeAnnouncements,
    isLoading,
    createConversation,
    sendMessage,
    resolveConversation,
    setPriority,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    catalogByArea,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    clearAllData,
  ]);
});
