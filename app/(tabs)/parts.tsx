import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Package, Wrench } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { CatalogItem } from '@/types';

export default function PartsScreen() {
  const { user } = useAuth();
  const { catalogByArea, createConversation } = useData();
  const insets = useSafeAreaInsets();

  const partsItems = catalogByArea('Peças');

  const handleRequestPart = async (item: CatalogItem) => {
    if (user?.type === 'client') {
      const conversationId = await createConversation(
        'Peças',
        `Solicito peça: ${item.name}`
      );
      router.push(`/chat/${conversationId}` as any);
    }
  };

  const renderItem = ({ item }: { item: CatalogItem }) => (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Wrench size={32} color={Colors.area.pecas} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          {item.price && (
            <Text style={styles.price}>
              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          )}
        </View>
      </View>
      {user?.type === 'client' && (
        <Pressable
          style={styles.button}
          onPress={() => handleRequestPart(item)}
        >
          <Text style={styles.buttonText}>Solicitar Peça</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Peças</Text>
          <Text style={styles.subtitle}>Peças de reposição</Text>
        </View>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {partsItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color={Colors.textLight} />
          <Text style={styles.emptyText}>Nenhuma peça disponível</Text>
        </View>
      ) : (
        <FlatList
          data={partsItems}
          renderItem={renderItem}
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.area.pecas,
  },
  button: {
    backgroundColor: Colors.area.pecas,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});
