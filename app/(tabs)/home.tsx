import { Image } from 'expo-image';
import { AlertCircle, Bell, Megaphone, Sparkles, Wrench } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { Announcement } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const { announcements } = useData();
  const insets = useSafeAreaInsets();

  const getAnnouncementIcon = (type: Announcement['type']) => {
    const iconProps = { size: 20, color: Colors.surface };
    
    switch (type) {
      case 'news':
        return <Sparkles {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'maintenance':
        return <Wrench {...iconProps} />;
      case 'promotion':
        return <Megaphone {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getAnnouncementColor = (type: Announcement['type']) => {
    switch (type) {
      case 'news':
        return '#3B82F6';
      case 'warning':
        return '#F59E0B';
      case 'maintenance':
        return '#8B5CF6';
      case 'promotion':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const getAnnouncementLabel = (type: Announcement['type']) => {
    switch (type) {
      case 'news':
        return 'Novidade';
      case 'warning':
        return 'Aviso';
      case 'maintenance':
        return 'Manutenção';
      case 'promotion':
        return 'Promoção';
      default:
        return 'Anúncio';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => {
    const backgroundColor = getAnnouncementColor(item.type);

    return (
      <View style={styles.announcementCard}>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.announcementImage}
            contentFit="cover"
          />
        )}
        
        <View style={styles.announcementContent}>
          <View style={styles.announcementHeader}>
            <View style={[styles.typeBadge, { backgroundColor }]}>
              {getAnnouncementIcon(item.type)}
              <Text style={styles.typeBadgeText}>
                {getAnnouncementLabel(item.type)}
              </Text>
            </View>
            <Text style={styles.announcementDate}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementText}>{item.content}</Text>

          <View style={styles.announcementFooter}>
            <Text style={styles.announcementAuthor}>Por {item.createdBy}</Text>
            {item.expiresAt && (
              <Text style={styles.announcementExpiry}>
                Válido até {new Date(item.expiresAt).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.fullName.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>Confira as últimas novidades</Text>
        </View>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {announcements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Megaphone size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Nenhum aviso no momento</Text>
          <Text style={styles.emptyText}>
            Fique atento! Novidades e avisos importantes aparecerão aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncement}
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
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logo: {
    width: 50,
    height: 50,
  },
  list: {
    padding: 16,
  },
  announcementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  announcementImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.background,
  },
  announcementContent: {
    padding: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  announcementDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  announcementTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  announcementText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  announcementAuthor: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  announcementExpiry: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600' as const,
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
