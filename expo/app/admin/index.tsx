import { router } from 'expo-router';
import { ChevronRight, Package, Settings, Wrench } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { ConversationArea } from '@/types';

export default function AdminScreen() {
  const { user } = useAuth();
  const { catalog } = useData();
  const insets = useSafeAreaInsets();

  if (!user || !user.roles?.includes('Admin')) {
    router.replace('/');
    return null;
  }

  const areas: { name: ConversationArea; icon: any; color: string }[] = [
    { name: 'Vendas', icon: Package, color: Colors.primary },
    { name: 'Locação', icon: Package, color: Colors.area.locacao },
    { name: 'Assistência Técnica', icon: Wrench, color: Colors.area.assistencia },
    { name: 'Peças', icon: Wrench, color: Colors.area.pecas },
  ];

  const getAreaCount = (area: ConversationArea) => {
    return catalog.filter(item => item.category === area).length;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Settings size={32} color={Colors.primary} />
        <Text style={styles.title}>Administração</Text>
        <Text style={styles.subtitle}>Gerenciar conteúdos das abas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas</Text>
          <Text style={styles.sectionDescription}>
            Adicione e edite os itens do catálogo de cada área
          </Text>

          {areas.map((area) => {
            const Icon = area.icon;
            const count = getAreaCount(area.name);

            return (
              <Pressable
                key={area.name}
                style={styles.areaCard}
                onPress={() => router.push(`/admin/area/${encodeURIComponent(area.name)}` as any)}
              >
                <View style={styles.areaLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: area.color + '20' }]}>
                    <Icon size={28} color={area.color} />
                  </View>
                  <View style={styles.areaInfo}>
                    <Text style={styles.areaName}>{area.name}</Text>
                    <Text style={styles.areaCount}>
                      {count} {count === 1 ? 'item' : 'itens'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={24} color={Colors.textLight} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  areaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  areaCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
