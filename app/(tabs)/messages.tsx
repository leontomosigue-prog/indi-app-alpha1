import { Image } from 'expo-image';
import { MessageSquare } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { Conversation } from '@/types';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { conversations } = useData();
  const insets = useSafeAreaInsets();

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Vendas': return Colors.area.vendas;
      case 'Locação': return Colors.area.locacao;
      case 'Assistência Técnica': return Colors.area.assistencia;
      case 'Peças': return Colors.area.pecas;
      default: return Colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const isResolved = item.status === 'resolved';

    return (
      <Pressable
        style={[styles.conversationCard, isResolved && styles.conversationResolved]}
      >
        <View style={styles.conversationHeader}>
          <View style={[styles.areaBadge, { backgroundColor: getAreaColor(item.area) }]}>
            <Text style={styles.areaBadgeText}>{item.area}</Text>
          </View>
          {isResolved && (
            <View style={styles.resolvedBadge}>
              <Text style={styles.resolvedText}>Resolvido</Text>
            </View>
          )}
        </View>

        <Text style={styles.conversationTitle} numberOfLines={1}>
          {user?.type === 'client' ? item.area : item.clientName}
        </Text>

        <Text style={styles.conversationReason} numberOfLines={1}>
          {item.reason}
        </Text>

        {lastMessage && (
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
            <Text style={styles.lastMessageTime}>
              {formatDate(lastMessage.timestamp)}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mensagens</Text>
          <Text style={styles.subtitle}>
            {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageSquare size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
          <Text style={styles.emptyText}>
            {user?.type === 'client'
              ? 'Inicie uma conversa através das abas de serviços'
              : 'Aguardando novas solicitações'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  conversationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conversationResolved: {
    opacity: 0.6,
  },
  conversationHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  areaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  areaBadgeText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  resolvedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.success,
  },
  resolvedText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  conversationReason: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: Colors.textLight,
  },
  lastMessageTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
