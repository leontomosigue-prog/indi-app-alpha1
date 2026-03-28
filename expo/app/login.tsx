import { router } from 'expo-router';
import { Fingerprint, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { login, loginWithBiometric, biometricAvailable } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log('handleLogin: Starting login process...');
    console.log('handleLogin: Email:', email);
    
    if (!email.trim() || !password.trim()) {
      console.log('handleLogin: Missing credentials');
      Alert.alert('Atenção', 'Preencha e-mail e senha');
      return;
    }

    setIsLoading(true);
    console.log('handleLogin: Calling login function...');
    const result = await login(email.trim(), password);
    console.log('handleLogin: Login result:', result);
    setIsLoading(false);

    if (!result.success) {
      console.log('handleLogin: Login failed:', result.error);
      Alert.alert('Erro', result.error || 'Erro ao fazer login');
    }
  };

  const handleBiometric = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail para fazer login com biometria');
      return;
    }

    setIsLoading(true);
    const result = await loginWithBiometric(email.trim());
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro na autenticação');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Função em desenvolvimento',
      'Contate o suporte da Indi.',
      [{ text: 'OK' }]
    );
  };



  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.backgroundDecor}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcome}>Bem-vindo de volta</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!isLoading}
                onSubmitEditing={handleLogin}
              />
            </View>

            <Pressable
              style={styles.forgotButton}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </Pressable>

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </Pressable>

            {biometricAvailable && (
              <Pressable
                style={styles.biometricButton}
                onPress={handleBiometric}
                disabled={isLoading}
              >
                <Fingerprint size={24} color={Colors.primary} />
                <Text style={styles.biometricText}>
                  {email.trim() ? 'Entrar com biometria' : 'Digite o e-mail para usar biometria'}
                </Text>
              </Pressable>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.registerButton}
              onPress={() => router.push('/register')}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>Criar conta como Cliente</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Colaborador? Use suas credenciais fornecidas</Text>
            <Text style={styles.testInfo}>
              {'\n'}Para testar:{'\n'}
              Cliente: cliente@teste.com{'\n'}
              Vendedor: vendedor@indi.com{'\n'}
              Admin: admin@indi.com{'\n'}
              (qualquer senha)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.secondary,
    opacity: 0.03,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 8,
  },
  welcome: {
    fontSize: 20,
    color: Colors.text,
    marginTop: 24,
    fontWeight: '500' as const,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    marginBottom: 24,
    gap: 8,
  },
  biometricText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textLight,
    fontSize: 14,
    marginHorizontal: 16,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  testInfo: {
    color: Colors.textLight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
