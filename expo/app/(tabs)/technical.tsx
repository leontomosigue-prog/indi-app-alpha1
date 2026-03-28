import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Wrench, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function TechnicalScreen() {
  const { user } = useAuth();
  const { createConversation } = useData();
  const insets = useSafeAreaInsets();
  const [showForm, setShowForm] = useState(false);
  const [machineModel, setMachineModel] = useState('');
  const [year, setYear] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [urgency, setUrgency] = useState<'Preventiva' | 'Urgente' | 'Para Ontem'>('Preventiva');

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setMachineModel('');
    setYear('');
    setSymptoms('');
    setUrgency('Preventiva');
  };

  const handleSubmit = async () => {
    if (user?.type === 'client' && machineModel.trim() && symptoms.trim()) {
      const reason = `Modelo: ${machineModel}${year ? ` | Ano: ${year}` : ''}\nUrgência: ${urgency}\n\nSintomas/Observações:\n${symptoms}`;
      
      const conversationId = await createConversation(
        'Assistência Técnica',
        reason,
        urgency
      );
      
      handleCloseForm();
      router.push(`/chat/${conversationId}` as any);
    }
  };

  if (user?.type === 'employee') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Assistência Técnica</Text>
            <Text style={styles.subtitle}>Atendimentos de assistência</Text>
          </View>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.emptyContainer}>
          <Wrench size={64} color={Colors.textLight} />
          <Text style={styles.emptyText}>
            Atendimentos aparecerão na aba Início
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Assistência Técnica</Text>
          <Text style={styles.subtitle}>Suporte e manutenção</Text>
        </View>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ue6uqxz1etc5e9ugf0ci0' }}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Wrench size={48} color={Colors.area.assistencia} />
          <Text style={styles.infoTitle}>Precisa de suporte técnico?</Text>
          <Text style={styles.infoDescription}>
            Nossa equipe está pronta para atender suas necessidades de manutenção preventiva,
            reparos urgentes e assistência técnica especializada.
          </Text>

          <View style={styles.priorityInfo}>
            <Text style={styles.priorityTitle}>Níveis de prioridade:</Text>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: Colors.priority.preventiva }]} />
              <Text style={styles.priorityLabel}>Preventiva - Manutenção programada</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: Colors.priority.urgente }]} />
              <Text style={styles.priorityLabel}>Urgente - Necessita atenção rápida</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: Colors.priority.paraOntem }]} />
              <Text style={styles.priorityLabel}>Para Ontem - Emergência crítica</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleOpenForm}>
          <Wrench size={20} color={Colors.surface} />
          <Text style={styles.buttonText}>Abrir Atendimento Técnico</Text>
        </Pressable>
      </View>

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseForm}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Atendimento Técnico</Text>
              <Pressable onPress={handleCloseForm} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Modelo da Máquina *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Empilhadeira XYZ 2000"
                placeholderTextColor={Colors.textLight}
                value={machineModel}
                onChangeText={setMachineModel}
              />

              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 2020"
                placeholderTextColor={Colors.textLight}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                maxLength={4}
              />

              <Text style={styles.label}>Sintomas/Observações *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o problema ou serviço necessário"
                placeholderTextColor={Colors.textLight}
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Nível de Urgência *</Text>
              <View style={styles.urgencyContainer}>
                <Pressable
                  style={[
                    styles.urgencyOption,
                    urgency === 'Preventiva' && styles.urgencyOptionSelected,
                    { borderColor: Colors.priority.preventiva },
                    urgency === 'Preventiva' && { backgroundColor: Colors.priority.preventiva }
                  ]}
                  onPress={() => setUrgency('Preventiva')}
                >
                  <View style={[
                    styles.urgencyDot,
                    { backgroundColor: urgency === 'Preventiva' ? Colors.surface : Colors.priority.preventiva }
                  ]} />
                  <View style={styles.urgencyTextContainer}>
                    <Text style={[
                      styles.urgencyTitle,
                      urgency === 'Preventiva' && styles.urgencyTitleSelected
                    ]}>
                      Preventiva
                    </Text>
                    <Text style={[
                      styles.urgencyDescription,
                      urgency === 'Preventiva' && styles.urgencyDescriptionSelected
                    ]}>
                      Manutenção programada
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={[
                    styles.urgencyOption,
                    urgency === 'Urgente' && styles.urgencyOptionSelected,
                    { borderColor: Colors.priority.urgente },
                    urgency === 'Urgente' && { backgroundColor: Colors.priority.urgente }
                  ]}
                  onPress={() => setUrgency('Urgente')}
                >
                  <View style={[
                    styles.urgencyDot,
                    { backgroundColor: urgency === 'Urgente' ? Colors.surface : Colors.priority.urgente }
                  ]} />
                  <View style={styles.urgencyTextContainer}>
                    <Text style={[
                      styles.urgencyTitle,
                      urgency === 'Urgente' && styles.urgencyTitleSelected
                    ]}>
                      Urgente
                    </Text>
                    <Text style={[
                      styles.urgencyDescription,
                      urgency === 'Urgente' && styles.urgencyDescriptionSelected
                    ]}>
                      Necessita atenção rápida
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={[
                    styles.urgencyOption,
                    urgency === 'Para Ontem' && styles.urgencyOptionSelected,
                    { borderColor: Colors.priority.paraOntem },
                    urgency === 'Para Ontem' && { backgroundColor: Colors.priority.paraOntem }
                  ]}
                  onPress={() => setUrgency('Para Ontem')}
                >
                  <View style={[
                    styles.urgencyDot,
                    { backgroundColor: urgency === 'Para Ontem' ? Colors.surface : Colors.priority.paraOntem }
                  ]} />
                  <View style={styles.urgencyTextContainer}>
                    <Text style={[
                      styles.urgencyTitle,
                      urgency === 'Para Ontem' && styles.urgencyTitleSelected
                    ]}>
                      Para Ontem
                    </Text>
                    <Text style={[
                      styles.urgencyDescription,
                      urgency === 'Para Ontem' && styles.urgencyDescriptionSelected
                    ]}>
                      Emergência crítica
                    </Text>
                  </View>
                </Pressable>
              </View>

              <Text style={styles.requiredNote}>* Campos obrigatórios</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.submitButton, (!machineModel.trim() || !symptoms.trim()) && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!machineModel.trim() || !symptoms.trim()}
              >
                <Text style={styles.submitButtonText}>Enviar e Abrir Chat</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  priorityInfo: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.area.assistencia,
    borderRadius: 12,
    paddingVertical: 16,
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
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  requiredNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 16,
    fontStyle: 'italic' as const,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: Colors.area.assistencia,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  urgencyContainer: {
    gap: 12,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  urgencyOptionSelected: {
    borderWidth: 2,
  },
  urgencyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  urgencyTextContainer: {
    flex: 1,
  },
  urgencyTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  urgencyTitleSelected: {
    color: Colors.surface,
  },
  urgencyDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  urgencyDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
