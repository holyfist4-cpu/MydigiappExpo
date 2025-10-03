
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { GiftedChat, IMessage, Send, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { AIChatService } from '../services/aiChatService';
import { ChatMessage } from '../types';
import Icon from '../components/Icon';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage = AIChatService.generateWelcomeMessage();
    setMessages([welcomeMessage as IMessage]);
    setQuickReplies(AIChatService.generateQuickReplies());
  }, []);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const userMessage = newMessages[0];
    
    // Add user message immediately
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setIsTyping(true);
    setQuickReplies([]); // Hide quick replies when user starts typing

    try {
      // Process message with AI
      const aiResponse = await AIChatService.processMessage(userMessage.text);
      
      // Create AI response message
      const aiMessage: IMessage = {
        _id: Date.now(),
        text: aiResponse.message,
        createdAt: new Date(),
        user: {
          _id: 'ai-assistant',
          name: 'Assistant Digigate',
          avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100'
        }
      };

      // Add AI response
      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
      
      // Handle escalation to human
      if (aiResponse.escalateToHuman) {
        setTimeout(() => {
          Alert.alert(
            'Transfert vers un agent',
            'Votre demande a été transférée à notre équipe de support. Un agent vous contactera bientôt.',
            [{ text: 'OK' }]
          );
        }, 1000);
      }

      // Show suggestions as quick replies
      if (aiResponse.suggestions) {
        setQuickReplies(aiResponse.suggestions);
      }

    } catch (error) {
      console.log('Error processing AI message:', error);
      
      // Fallback error message
      const errorMessage: IMessage = {
        _id: Date.now(),
        text: 'Désolé, je rencontre un problème technique. Veuillez réessayer ou contacter notre support directement.',
        createdAt: new Date(),
        user: {
          _id: 'ai-assistant',
          name: 'Assistant Digigate',
          avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100'
        }
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleQuickReply = (reply: string) => {
    const message: IMessage = {
      _id: Date.now(),
      text: reply,
      createdAt: new Date(),
      user: {
        _id: 'user',
        name: 'Vous'
      }
    };
    
    onSend([message]);
  };

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Icon name="send" size={20} color={colors.primary} />
      </View>
    </Send>
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: colors.primary,
        },
        left: {
          backgroundColor: colors.backgroundAlt,
        }
      }}
      textStyle={{
        right: {
          color: colors.background,
        },
        left: {
          color: colors.text,
        }
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputPrimary}
    />
  );

  const renderQuickReplies = () => {
    if (quickReplies.length === 0) return null;

    return (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesTitle}>Réponses rapides :</Text>
        <View style={styles.quickRepliesRow}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Support IA</Text>
          <Text style={styles.headerSubtitle}>Assistant Digigate</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
        </View>
      </View>

      {/* Chat */}
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 'user',
            name: 'Vous'
          }}
          isTyping={isTyping}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          placeholder="Tapez votre message..."
          alwaysShowSend
          scrollToBottom
          showUserAvatar={false}
        />
        
        {/* Quick Replies */}
        {renderQuickReplies()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
  },
  inputToolbar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  quickRepliesContainer: {
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickRepliesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  quickRepliesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReplyButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickReplyText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
