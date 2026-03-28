import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { ConversationArea } from '@/types';

export default function ItemFormScreen() {
  const { id } = useLocalSearchParams<{ id: string; area?: string }>();
  const { user } = useAuth();
  const { catalog, addCatalogItem, updateCatalogItem } = useData();
  const insets = useSafeAreaInsets();

  const isNewItem = id === 'new';
  const existingItem = isNewItem ? null : catalog.find(item => item.id === id);

  const areaParam = useLocalSearchParams<{ area?: string }>().area;
  const initialArea = existingItem?.category || (areaParam ? decodeURIComponent(areaParam) : 'Vendas') as ConversationArea;

  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [category, setCategory] = useState<ConversationArea>(initialArea);
  const [imageUrl, setImageUrl] = useState(existingItem?.imageUrl || '');
  const [price, setPrice] = useState(existingItem?.price?.toString() || '');
  const [available, setAvailable] = useState(existingItem?.available ?? true);
  const [isSaving, setIsSaving] = useState(false);

  if (!user || !user.roles?.includes('Admin')) {
    router.replace('/');
    return null;
  }

  const categories: ConversationArea[] = ['Vendas', 'Locação', 'Assistência Técnica', 'Peças'];

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      const itemData = {
        name: name.trim(),
        description: description.trim(),
        category,
        imageUrl: imageUrl.trim() || undefined,
        price: price.trim() ? parseFloat(price.replace(',', '.')) : undefined,
        available,
      };

      if (isNewItem) {
        await addCatalogItem(itemData);
        Alert.alert('Sucesso', 'Item adicionado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        await updateCatalogItem(id, itemData);
        Alert.alert('Sucesso', 'Item atualizado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o item. Tente novamente.');
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>{isNewItem ? 'Novo Item' : 'Editar Item'}</Text>
        <Pressable 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Check size={24} color={Colors.primary} />
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Empilhadeira Elétrica 2T"
            placeholderTextColor={Colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição detalhada do item"
            placeholderTextColor={Colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>URL da Imagem</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={Colors.textLight}
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.hint}>Deixe em branco se não tiver imagem</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor={Colors.textLight}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <Text style={styles.hint}>
            {category === 'Locação' ? 'Preço por dia' : 'Deixe em branco se não aplicável'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Disponível</Text>
              <Text style={styles.switchDescription}>
                Item visível para clientes nas abas
              </Text>
            </View>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        <Text style={styles.requiredNote}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  saveButton: {
    padding: 4,
    width: 40,
    alignItems: 'flex-end',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  categoryButtonTextActive: {
    color: Colors.surface,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  requiredNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginHorizontal: 16,
    marginBottom: 32,
    fontStyle: 'italic' as const,
  },
});
