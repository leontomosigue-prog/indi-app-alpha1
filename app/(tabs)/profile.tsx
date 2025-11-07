import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight, Edit, Fingerprint, LogOut, Mail, Phone, Settings, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout, biometricAvailable, toggleBiometric } = useAuth();
  const insets = useSafeAreaInsets();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [clickTest, setClickTest] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    console.log('🟢 PROFILE: handleLogout chamado!');
    setClickTest(true);
    setTimeout(() => setClickTest(false), 2000);
    
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            console.log('🔵 PROFILE: Botão Sair pressionado');
            setIsLoggingOut(true);
            try {
              await logout();
              console.log('🔵 PROFILE: Logout executado com sucesso');
            } catch (error) {
              console.error('🔵 PROFILE: Erro no logout:', error);
              setIsLoggingOut(false);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ],
    );
  };

  const handleToggleBiometric = async () => {
    const newValue = !user.biometricEnabled;
    const result = await toggleBiometric(newValue);
    
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Não foi possível alterar a biometria');
    }
  };

  const isClient = user.type === 'client';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.headerLogo}
          contentFit="contain"
        />
        <View style={styles.avatar}>
          <UserIcon size={48} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {!isClient && user.roles && (
          <View style={styles.rolesContainer}>
            {user.roles.map((role) => (
              <View key={role} style={styles.roleBadge}>
                <Text style={styles.roleText}>{role}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <Pressable style={styles.editButton} onPress={() => router.push('/edit-profile')}>
            <Edit size={20} color={Colors.primary} />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
            <ChevronRight size={20} color={Colors.primary} />
          </Pressable>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <UserIcon size={20} color={Colors.textSecondary} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Nome completo</Text>
                <Text style={styles.infoValue}>{user.fullName}</Text>
              </View>
            </View>

            {user.phone && (
              <View style={styles.infoItem}>
                <Phone size={20} color={Colors.textSecondary} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <Mail size={20} color={Colors.textSecondary} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            {isClient && user.companyName && (
              <View style={styles.infoItem}>
                <UserIcon size={20} color={Colors.textSecondary} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Empresa</Text>
                  <Text style={styles.infoValue}>{user.companyName}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {user.roles?.includes('Admin') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administração</Text>
            <Pressable style={styles.adminButton} onPress={() => router.push('/admin')}>
              <Settings size={20} color={Colors.primary} />
              <Text style={styles.adminButtonText}>Gerenciar Conteúdos</Text>
              <ChevronRight size={20} color={Colors.primary} />
            </Pressable>
          </View>
        )}

        {Platform.OS !== 'web' && biometricAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança</Text>
            <View style={styles.optionCard}>
              <View style={styles.optionContent}>
                <Fingerprint size={24} color={Colors.primary} />
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>Login por biometria</Text>
                  <Text style={styles.optionDescription}>
                    Use {Platform.OS === 'ios' ? 'Face ID ou Touch ID' : 'impressão digital'} para entrar
                  </Text>
                </View>
              </View>
              <Switch
                value={user.biometricEnabled}
                onValueChange={handleToggleBiometric}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          {clickTest && (
            <View style={styles.testBanner}>
              <Text style={styles.testBannerText}>✅ Clique capturado!</Text>
            </View>
          )}
          
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <View style={styles.logoutContent}>
              <LogOut size={24} color={Colors.error} />
              <Text style={styles.logoutLabel}>
                {isLoggingOut ? 'Saindo...' : 'Sair'}
              </Text>
            </View>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <ChevronRight size={20} color={Colors.textLight} />
            )}
          </TouchableOpacity>
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
  headerLogo: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'center',
  },
  roleBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  optionCardDisabled: {
    opacity: 0.6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 8,
  },
  editButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  adminButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  testBanner: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  testBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer' as any,
      userSelect: 'none' as any,
      WebkitUserSelect: 'none' as any,
      MozUserSelect: 'none' as any,
      msUserSelect: 'none' as any,
      WebkitTouchCallout: 'none' as any,
      WebkitTapHighlightColor: 'transparent' as any,
    } : {}),
  },
  logoutButtonDisabled: {
    opacity: 0.6,
    ...(Platform.OS === 'web' ? {
      cursor: 'not-allowed' as any,
    } : {}),
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.error,
    ...(Platform.OS === 'web' ? {
      userSelect: 'none' as any,
      WebkitUserSelect: 'none' as any,
      MozUserSelect: 'none' as any,
      msUserSelect: 'none' as any,
      pointerEvents: 'none' as any,
    } : {}),
  },
});
