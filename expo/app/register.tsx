import { router } from 'expo-router';
import { Building2, Check, FileText, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

const LGPD_TEXT = `Ao criar uma conta, você concorda com a coleta e processamento de seus dados pessoais para fins de atendimento, conforme nossa Política de Privacidade e a Lei Geral de Proteção de Dados (LGPD).

Seus dados serão utilizados exclusivamente para:
• Identificação e comunicação
• Processamento de solicitações e atendimentos
• Melhorias no serviço prestado

Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através de nossos canais de atendimento.`;

export default function RegisterScreen() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [showLgpd, setShowLgpd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  };

  const formatCNPJ = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    return cnpj;
  };

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return phone;
  };

  const formatDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    }
    return birthDate;
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!birthDate || !cpf || !companyName || !cnpj) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não conferem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!lgpdAccepted) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos da LGPD para continuar');
      return;
    }

    setIsLoading(true);
    const result = await register({
      type: 'client',
      email: email.trim(),
      fullName: fullName.trim(),
      birthDate,
      cpf,
      companyName: companyName.trim(),
      cnpj,
      phone: phone.trim(),
      lgpdAccepted: true,
      biometricEnabled: false,
    });
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } else {
      Alert.alert('Erro', result.error || 'Erro ao criar conta');
    }
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Cadastro de Cliente</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo *"
                placeholderTextColor={Colors.textLight}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Data de nascimento (DD/MM/AAAA) *"
                placeholderTextColor={Colors.textLight}
                value={birthDate}
                onChangeText={(text) => setBirthDate(formatDate(text))}
                keyboardType="numeric"
                maxLength={10}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CPF *"
                placeholderTextColor={Colors.textLight}
                value={cpf}
                onChangeText={(text) => setCpf(formatCPF(text))}
                keyboardType="numeric"
                maxLength={14}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Building2 size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome da empresa *"
                placeholderTextColor={Colors.textLight}
                value={companyName}
                onChangeText={setCompanyName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CNPJ *"
                placeholderTextColor={Colors.textLight}
                value={cnpj}
                onChangeText={(text) => setCnpj(formatCNPJ(text))}
                keyboardType="numeric"
                maxLength={18}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor={Colors.textLight}
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail *"
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
              <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha (mín. 6 caracteres) *"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha *"
                placeholderTextColor={Colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <Pressable
              style={styles.lgpdButton}
              onPress={() => setShowLgpd(!showLgpd)}
              disabled={isLoading}
            >
              <Text style={styles.lgpdButtonText}>
                {showLgpd ? '▼' : '▶'} Ler Termos LGPD
              </Text>
            </Pressable>

            {showLgpd && (
              <View style={styles.lgpdBox}>
                <ScrollView style={styles.lgpdScroll} nestedScrollEnabled>
                  <Text style={styles.lgpdText}>{LGPD_TEXT}</Text>
                </ScrollView>
              </View>
            )}

            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setLgpdAccepted(!lgpdAccepted)}
              disabled={isLoading}
            >
              <View style={[styles.checkbox, lgpdAccepted && styles.checkboxChecked]}>
                {lgpdAccepted && <Check size={18} color={Colors.surface} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Aceito os termos da LGPD *
              </Text>
            </Pressable>

            <Pressable
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Já tenho conta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
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
  lgpdButton: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  lgpdButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  lgpdBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    maxHeight: 200,
  },
  lgpdScroll: {
    maxHeight: 168,
  },
  lgpdText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
