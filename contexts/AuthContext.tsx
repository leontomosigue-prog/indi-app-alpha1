import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { User } from '@/types';

const STORAGE_KEYS = {
  USER: '@indi:user',
  USERS_DB: '@indi:users_db',
  REQUIRE_MANUAL_LOGIN: '@indi:require_manual_login',
};

const MOCK_USERS: User[] = [
  {
    id: '1',
    type: 'client',
    email: 'cliente@teste.com',
    fullName: 'João Silva',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    companyName: 'Empresa Teste Ltda',
    cnpj: '12.345.678/0001-90',
    lgpdAccepted: true,
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'employee',
    email: 'vendedor@indi.com',
    fullName: 'Maria Santos',
    phone: '(11) 91234-5678',
    roles: ['Vendas'],
    lgpdAccepted: true,
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'employee',
    email: 'admin@indi.com',
    fullName: 'Carlos Admin',
    phone: '(11) 99999-9999',
    roles: ['Admin', 'Vendas', 'Locação', 'Assistência Técnica', 'Peças'],
    lgpdAccepted: true,
    biometricEnabled: false,
    createdAt: new Date().toISOString(),
  },
];

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const initializeAuth = useCallback(async () => {
    console.log('AuthContext: Initializing auth...');
    try {
      await initializeMockDB();
      
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        console.log('AuthContext: Stored user found');
        setUser(JSON.parse(storedUser));
      } else {
        console.log('AuthContext: No stored user found');
      }

      if (Platform.OS !== 'web') {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(compatible && enrolled);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      console.log('AuthContext: Initialization complete');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);



  const initializeMockDB = async () => {
    const existingDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!existingDB) {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(MOCK_USERS));
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('AuthContext: login chamado com email:', email);
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: User[] = usersDB ? JSON.parse(usersDB) : [];
      console.log('AuthContext: usuários encontrados:', users.length);
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        console.log('AuthContext: usuário não encontrado');
        return { success: false, error: 'E-mail ou senha incorretos' };
      }

      console.log('AuthContext: usuário encontrado, salvando no AsyncStorage');
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
      
      console.log('AuthContext: removendo flag de login manual obrigatório');
      await AsyncStorage.removeItem(STORAGE_KEYS.REQUIRE_MANUAL_LOGIN);
      
      console.log('AuthContext: setUser sendo chamado');
      setUser(foundUser);
      console.log('AuthContext: login concluído com sucesso');
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  }, []);

  const loginWithBiometric = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (Platform.OS === 'web') {
      return { success: false, error: 'Biometria não disponível na web' };
    }

    try {
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: User[] = usersDB ? JSON.parse(usersDB) : [];
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
      });

      if (result.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
        await AsyncStorage.removeItem(STORAGE_KEYS.REQUIRE_MANUAL_LOGIN);
        setUser(foundUser);
        return { success: true };
      }

      return { success: false, error: 'Autenticação biométrica cancelada' };
    } catch (error) {
      console.error('Biometric login error:', error);
      return { success: false, error: 'Erro na autenticação biométrica' };
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: User[] = usersDB ? JSON.parse(usersDB) : [];
      
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, error: 'E-mail já cadastrado' };
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🔴 LOGOUT: Iniciando logout...');
    try {
      console.log('🔴 LOGOUT: 1. Setando user como null...');
      setUser(null);
      
      console.log('🔴 LOGOUT: 2. Removendo todos os dados do usuário...');
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      
      console.log('🔴 LOGOUT: 3. Setando flag para exigir login manual...');
      await AsyncStorage.setItem(STORAGE_KEYS.REQUIRE_MANUAL_LOGIN, 'true');
      
      console.log('🔴 LOGOUT: 4. Navegando para login com replace...');
      router.replace('/login');
      console.log('🔴 LOGOUT: Logout concluído com sucesso!');
    } catch (error) {
      console.error('🔴 LOGOUT: Erro no logout:', error);
      setUser(null);
      router.replace('/login');
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      const updatedUser = { ...user, ...updates };
      
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const users: User[] = usersDB ? JSON.parse(usersDB) : [];
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Erro ao atualizar dados' };
    }
  }, [user]);

  const toggleBiometric = useCallback(async (enable: boolean): Promise<{ success: boolean; error?: string }> => {
    if (Platform.OS === 'web') {
      return { success: false, error: 'Biometria não disponível na web' };
    }

    if (!biometricAvailable) {
      return { success: false, error: 'Biometria não está disponível neste dispositivo' };
    }

    if (enable) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade',
        cancelLabel: 'Cancelar',
      });

      if (!result.success) {
        return { success: false, error: 'Autenticação falhou' };
      }
    }

    return await updateUser({ biometricEnabled: enable });
  }, [biometricAvailable, updateUser]);

  return useMemo(() => ({
    user,
    isLoading,
    biometricAvailable,
    login,
    loginWithBiometric,
    register,
    logout,
    updateUser,
    toggleBiometric,
    isAuthenticated: !!user,
  }), [user, isLoading, biometricAvailable, login, loginWithBiometric, register, logout, updateUser, toggleBiometric]);
});
