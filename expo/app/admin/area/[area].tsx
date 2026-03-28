import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle, ChevronLeft, Package, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { CatalogItem, ConversationArea } from '@/types';

export default function AreaManagementScreen() {
  const { area } = useLocalSearchParams<{ area: string }>();
  const { user } = useAuth();
  const { catalog, deleteCatalogItem } = useData();
  const insets = useSafeAreaInsets();

  if (!user || !user.roles?.includes('Admin') || !area) {
    router.replace('/');
    return null;
  }

  const decodedArea = decodeURIComponent(area) as ConversationArea;
  const areaItems = catalog.filter(item => item.category === decodedArea);

  const handleDelete = (item: CatalogItem) => {
    Alert.alert(
      'Excluir Item',
      `Tem certeza que deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCatalogItem(item.id);
              Alert.alert('Sucesso', 'Item excluído com sucesso!');
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o item.');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (item: CatalogItem) => {
    router.push(`/admin/item/${item.id}` as any);
  };

  const handleAddNew = () => {
    router.push(`/admin/item/new?area=${encodeURIComponent(decodedArea)}` as any);
  };

  const renderItem = ({ item }: { item: CatalogItem }) => (
    <View style={styles.card}>
      <Pressable style={styles.cardContent} onPress={() => handleEdit(item)}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Package size={32} color={Colors.textLight} />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.price && (
            <Text style={styles.itemPrice}>
              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          )}
          <View style={styles.statusBadge}>
            <AlertCircle size={12} color={item.available ? Colors.success : Colors.error} />
            <Text style={[styles.statusText, { color: item.available ? Colors.success : Colors.error }]}>
              {item.available ? 'Disponível' : 'Indisponível'}
            </Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Trash2 size={20} color={Colors.error} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{decodedArea}</Text>
          <Text style={styles.subtitle}>{areaItems.length} itens</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {areaItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Package size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Nenhum item cadastrado</Text>
          <Text style={styles.emptyDescription}>
            Clique no botão abaixo para adicionar o primeiro item
          </Text>
        </View>
      ) : (
        <FlatList
          data={areaItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={handleAddNew}>
          <Plus size={24} color={Colors.surface} />
          <Text style={styles.addButtonText}>Adicionar Item</Text>
        </Pressable>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
