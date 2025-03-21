import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {postApi} from '../utils/api';

const ConversationScreen = ({route, navigation}) => {
  const {conversation} = route.params;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Combine original message with replies in chronological order
    const initialMessage = {
      sender: conversation.sender,
      content: conversation.content,
      timestamp: conversation.timestamp,
      attachmentUrls: conversation.attachmentUrls || [],
      isOriginal: true,
    };

    const allMessages = [initialMessage, ...(conversation.replies || [])];
    setMessages(allMessages);
  }, [conversation]);

  const formatTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupMessagesByDate = () => {
    const groupedMessages = [];
    let currentDate = null;

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groupedMessages.push({
          type: 'date',
          date: message.timestamp,
          id: `date-${message.timestamp}`,
        });
      }

      groupedMessages.push({
        type: 'message',
        ...message,
        id: `message-${message.timestamp}-${Math.random()}`,
      });
    });

    return groupedMessages;
  };

  const isFromCurrentUser = async sender => {
    // Replace with actual logic to check if sender is current user
    // For demo purposes, assuming user@example.com is current user
    return sender === (await AsyncStorage.getItem('TeacherId'));
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && selectedAttachments.length === 0) return;

    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    const Teacher_id = (await AsyncStorage.getItem('TeacherId')) ?? '';

    const newMessageObj = {
      sender: Teacher_id,
      senderName: 'keerthi',
      senderType: 'TEACHER',
      content: messageContent,
      timestamp: new Date().toISOString(),
      attachmentUrls: selectedAttachments,
    };

    // Add message to UI immediately for better UX
    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    setSelectedAttachments([]);

    // Scroll to the latest message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);

    try {
      const Token = await AsyncStorage.getItem('Token');
      const url = `messages/${conversation.id}/reply`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const data = {
        content: messageContent,
        sender: Teacher_id,
        senderName: 'keerthi',
        senderType: 'TEACHER',
        attachmentUrls: selectedAttachments,
      };

      const onResponse = res => {
        console.log('Message sent successfully:', res);
        setSendingMessage(false);
      };

      const onCatch = err => {
        console.log('Error sending message:', err);
        setSendingMessage(false);
        // Show error to user
        Alert.alert('Error', 'Failed to send message. Please try again.');
      };

      postApi(url, headers, data, onResponse, onCatch);
    } catch (error) {
      console.log('Error sending message:', error);
      setSendingMessage(false);
    }
  };

  const renderItem = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      );
    }

    const isCurrentUser = isFromCurrentUser(item.sender);

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isCurrentUser
              ? styles.userMessageBubble
              : styles.otherMessageBubble,
            // item.isOriginal && styles.originalMessageBubble,
          ]}>
          {/* {!isCurrentUser && (
            <Text style={styles.messageSender}>{item.sender}</Text>
          )} */}

          <Text style={styles.messageContent}>{item.content}</Text>

          {item.attachmentUrls && item.attachmentUrls.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {item.attachmentUrls.map((url, index) => (
                <TouchableOpacity key={index} style={styles.attachment}>
                  <MaterialIcons name="attachment" size={20} color="#001d3d" />
                  <Text style={styles.attachmentText}>
                    {url.split('/').pop()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  const handleAttachment = () => {
    // This would be connected to a file picker
    console.log('Adding attachment');
    // For demo purposes, add a fake attachment
    setSelectedAttachments([
      ...selectedAttachments,
      `http://example.com/attachment${selectedAttachments.length + 1}.pdf`,
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#001d3d" />
        </TouchableOpacity>
        <View style={styles.appBarTitle}>
          <Text style={styles.conversationSubject}>{conversation.subject}</Text>
        </View>
        <TouchableOpacity onPress={() => console.log('More options')}>
          <MaterialIcons name="more-vert" size={28} color="#001d3d" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#001d3d" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={groupMessagesByDate()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({animated: false})}
        />
      )}

      {/* Selected attachments */}
      {selectedAttachments.length > 0 && (
        <View style={styles.selectedAttachmentsContainer}>
          <FlatList
            data={selectedAttachments}
            horizontal
            renderItem={({item, index}) => (
              <View style={styles.selectedAttachment}>
                <Text style={styles.selectedAttachmentText} numberOfLines={1}>
                  {item.split('/').pop()}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const newAttachments = [...selectedAttachments];
                    newAttachments.splice(index, 1);
                    setSelectedAttachments(newAttachments);
                  }}>
                  <Ionicons name="close-circle" size={20} color="#001d3d" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => `attachment-${index}`}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttachment}>
          <Ionicons name="attach" size={24} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            newMessage.trim() === '' &&
              selectedAttachments.length === 0 &&
              styles.sendButtonDisabled,
          ]}
          disabled={
            (newMessage.trim() === '' && selectedAttachments.length === 0) ||
            sendingMessage
          }
          onPress={sendMessage}>
          {sendingMessage ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  appBarTitle: {
    flex: 1,
    marginHorizontal: 15,
  },
  conversationSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001d3d',
  },
  conversationInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  messagesList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: 'rgb(229,235,252)',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  originalMessageBubble: {
    backgroundColor: '#e5ebfc',
    borderWidth: 1,
    borderColor: '#d0d7eb',
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  messageContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e5ebfc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 29, 61, 0.1)',
    padding: 6,
    borderRadius: 8,
    marginVertical: 2,
  },
  attachmentText: {
    fontSize: 12,
    color: '#001d3d',
    marginLeft: 5,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    marginHorizontal: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#001d3d',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#999',
  },
  selectedAttachmentsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectedAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5ebfc',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    maxWidth: 200,
  },
  selectedAttachmentText: {
    fontSize: 12,
    color: '#001d3d',
    marginRight: 5,
    maxWidth: 150,
  },
});
