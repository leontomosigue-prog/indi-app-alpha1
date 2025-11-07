import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Paperclip, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import type { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { conversations, sendMessage, resolveConversation } = useData();
  const insets = useSafeAreaInsets();

  const [messageText, setMessageText] = useState('');

  const conversation = conversations.find(c => c.id === id);

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversa não encontrada</Text>
      </View>
    );
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    try {
      await sendMessage(conversation.id, messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleResolve = async () => {
    try {
      await resolveConversation(conversation.id);
      router.back();
    } catch (error) {
      console.error('Error resolving conversation:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {!isOwnMessage && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'Vendas': return Colors.area.vendas;
      case 'Locação': return Colors.area.locacao;
      case 'Assistência Técnica': return Colors.area.assistencia;
      case 'Peças': return Colors.area.pecas;
      default: return Colors.primary;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: user?.type === 'client' ? conversation.area : conversation.clientName,
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </Pressable>
          ),
          headerRight: () =>
            user?.type === 'employee' ? (
              <Pressable onPress={handleResolve} style={styles.resolvedButton}>
                <Text style={styles.resolvedButtonText}>RESOLVIDO</Text>
              </Pressable>
            ) : null,
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.infoBar}>
          <View style={[styles.areaBadge, { backgroundColor: getAreaColor(conversation.area) }]}>
            <Text style={styles.areaBadgeText}>{conversation.area}</Text>
          </View>
          <Text style={styles.reasonText} numberOfLines={1}>
            {conversation.reason}
          </Text>
          {conversation.priority && (
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityText}>{conversation.priority}</Text>
            </View>
          )}
        </View>

        <FlatList
          data={conversation.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messagesList, { paddingBottom: insets.bottom }]}
          inverted={false}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 8 }]}>
          <Pressable style={styles.attachButton}>
            <Paperclip size={24} color={Colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.textLight}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={Colors.surface} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  resolvedButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  resolvedButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  areaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  areaBadgeText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priorityContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.error,
  },
  priorityText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  ownMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.surface,
  },
  otherMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  attachButton: {
    padding: 8,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
