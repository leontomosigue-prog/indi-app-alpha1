import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Package, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image as RNImage, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { CatalogItem } from '@/types';

export default function SalesScreen() {
  const { user } = useAuth();
  const { catalogByArea, createConversation } = useData();
  const insets = useSafeAreaInsets();

  const salesItems = catalogByArea('Vendas');

  const handleRequestPurchase = async (item: CatalogItem) => {
    if (user?.type === 'client') {
      const conversationId = await createConversation(
        'Vendas',
        `Solicito compra: ${item.name}`
      );
      router.push(`/chat/${conversationId}` as any);
    }
  };

  const renderItem = ({ item }: { item: CatalogItem }) => (
    <View style={styles.card}>
      {item.imageUrl && (
        <RNImage
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        {item.price && (
          <Text style={styles.price}>
            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        )}
        {user?.type === 'client' && (
          <Pressable
            style={styles.button}
            onPress={() => handleRequestPurchase(item)}
          >
            <ShoppingCart size={18} color={Colors.surface} />
            <Text style={styles.buttonText}>Solicitar Compra</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Vendas</Text>
          <Text style={styles.subtitle}>Catálogo de equipamentos</Text>
        </View>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {salesItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color={Colors.textLight} />
          <Text style={styles.emptyText}>Nenhum item disponível</Text>
        </View>
      ) : (
        <FlatList
          data={salesItems}
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
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 16,
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
