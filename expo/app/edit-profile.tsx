import { router, Stack } from 'expo-router';
import { Lock, Mail, Phone, User as UserIcon, Calendar, FileText, Building } from 'lucide-react-native';
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

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [cpf, setCpf] = useState(user?.cpf || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [cnpj, setCnpj] = useState(user?.cnpj || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isClient = user?.type === 'client';

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Atenção', 'Nome completo é obrigatório');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'E-mail é obrigatório');
      return;
    }

    if (isClient) {
      if (!cpf?.trim()) {
        Alert.alert('Atenção', 'CPF é obrigatório');
        return;
      }
      if (!companyName?.trim()) {
        Alert.alert('Atenção', 'Nome da empresa é obrigatório');
        return;
      }
      if (!cnpj?.trim()) {
        Alert.alert('Atenção', 'CNPJ é obrigatório');
        return;
      }
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        Alert.alert('Atenção', 'As senhas não coincidem');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Atenção', 'A nova senha deve ter no mínimo 6 caracteres');
        return;
      }
    }

    setIsLoading(true);

    const updates: any = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (isClient) {
      updates.birthDate = birthDate;
      updates.cpf = cpf;
      updates.companyName = companyName;
      updates.cnpj = cnpj;
    }

    const result = await updateUser(updates);

    setIsLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Dados atualizados com sucesso', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Erro', result.error || 'Erro ao atualizar dados');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Editar Perfil',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
        }}
      />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>

              <View style={styles.inputContainer}>
                <UserIcon size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor={Colors.textLight}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />
              </View>

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
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>

              {isClient && (
                <>
                  <View style={styles.inputContainer}>
                    <Calendar size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Data de Nascimento (DD/MM/AAAA)"
                      placeholderTextColor={Colors.textLight}
                      value={birthDate}
                      onChangeText={setBirthDate}
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="CPF"
                      placeholderTextColor={Colors.textLight}
                      value={cpf}
                      onChangeText={setCpf}
                      keyboardType="numeric"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Building size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nome da Empresa"
                      placeholderTextColor={Colors.textLight}
                      value={companyName}
                      onChangeText={setCompanyName}
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <FileText size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="CNPJ"
                      placeholderTextColor={Colors.textLight}
                      value={cnpj}
                      onChangeText={setCnpj}
                      keyboardType="numeric"
                      editable={!isLoading}
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alterar Senha (Opcional)</Text>
              <Text style={styles.sectionDescription}>
                Deixe em branco se não deseja alterar
              </Text>

              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha atual"
                  placeholderTextColor={Colors.textLight}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nova senha"
                  placeholderTextColor={Colors.textLight}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar nova senha"
                  placeholderTextColor={Colors.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            <Pressable
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
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
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
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
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
