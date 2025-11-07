import { Tabs } from 'expo-router';
import { Home, MessageSquare, Package, User, Wrench } from 'lucide-react-native';
import React from 'react';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const auth = useAuth();
  const user = auth?.user;

  console.log('TabLayout: user=', user ? `${user.type} - ${user.fullName}` : 'null');

  if (!user) {
    console.log('TabLayout: No user, not rendering tabs');
    return null;
  }

  const isClient = user.type === 'client';
  const hasRole = (role: string) => user.roles?.includes(role as any) || user.roles?.includes('Admin');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarLabel: 'Início',
          tabBarAccessibilityLabel: 'Aba Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="sales"
        options={{
          title: 'Vendas',
          tabBarLabel: 'Vendas',
          tabBarAccessibilityLabel: 'Aba Vendas',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          href: isClient || hasRole('Vendas') ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="rental"
        options={{
          title: 'Locação',
          tabBarLabel: 'Locação',
          tabBarAccessibilityLabel: 'Aba Locação',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          href: isClient || hasRole('Locação') ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="technical"
        options={{
          title: 'Assistência',
          tabBarLabel: 'Assistência',
          tabBarAccessibilityLabel: 'Aba Assistência',
          tabBarIcon: ({ color, size }) => <Wrench size={size} color={color} />,
          href: isClient || hasRole('Assistência Técnica') ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="parts"
        options={{
          title: 'Peças',
          tabBarLabel: 'Peças',
          tabBarAccessibilityLabel: 'Aba Peças',
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          href: isClient || hasRole('Peças') ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mensagens',
          tabBarLabel: 'Mensagens',
          tabBarAccessibilityLabel: 'Aba Mensagens',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarAccessibilityLabel: 'Aba Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
