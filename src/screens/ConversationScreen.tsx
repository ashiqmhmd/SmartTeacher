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
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getapi, patchApi, postApi} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pick} from '@react-native-documents/picker';

const ConversationScreen = ({route, navigation}) => {
  const {
    conversation: initialConversation,
    deeplink,
    conversationId,
  } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [formData, setFormData] = useState(null);
  const flatListRef = useRef(null);

  const loadUserData = async () => {
    try {
      const id = (await AsyncStorage.getItem('TeacherId')) || '';
      setTeacherId(id);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  };

  useEffect(() => {
    loadUserData();
    if (deeplink && conversationId) {
      console.log('Loading conversation from deeplink:', conversationId);
      getMessageById(conversationId);
    } else if (initialConversation) {
      // Combine original message with replies in chronological order
      const initialMessage = {
        sender: initialConversation?.sender,
        content: initialConversation?.content,
        timestamp: initialConversation?.timestamp,
        attachmentUrls: initialConversation?.attachmentUrls || [],
        isOriginal: true,
      };

      const allMessages = [
        initialMessage,
        ...(initialConversation?.replies || []),
      ];
      setMessages(allMessages);
    } else {
      setError('No conversation data provided');
    }
  }, [initialConversation, deeplink, conversationId]);

  const getMessageById = async id => {
    setLoading(true);
    setError(null);

    try {
      const Token = await AsyncStorage.getItem('Token');
      const url = `/messages/${id}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const onResponse = res => {
        if (res) {
          const originalMessage = {
            id: res.id,
            sender: res.sender,
            senderName: res.senderName,
            senderType: res.senderType,
            content: res.content,
            timestamp: res.timestamp,
            attachmentUrls: res.attachmentUrls || [],
            isOriginal: true,
          };

          // Map replies to match the same structure as the original message
          const replies = res.replies.map(reply => ({
            id: reply.id || `reply-${Math.random()}`,
            sender: reply.sender,
            senderName: reply.senderName,
            senderType: reply.senderType,
            content: reply.content,
            timestamp: reply.timestamp,
            attachmentUrls: reply.attachmentUrls || [],
            isOriginal: false,
          }));

          // Combine original message and replies into a single array
          const allMessages = [originalMessage, ...replies];

          // Sort messages by timestamp
          allMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          );

          setMessages(allMessages);
        } else {
          setError('Failed to load conversation');
        }
        setLoading(false);
      };

      const onCatch = err => {
        console.error('Error fetching messages:', err);
        setError('Failed to load conversation. Please try again.');
        setLoading(false);
      };

      getapi(url, headers, onResponse, onCatch);
    } catch (err) {
      console.error('Exception when fetching messages:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

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
        id: message.id || `message-${message.timestamp}-${Math.random()}`,
      });
    });

    return groupedMessages;
  };

  const isFromCurrentUser = sender => {
    return sender === teacherId;
  };

  const handleAttachment = async () => {
    try {
      const result = await pick({
        type: ['*/*'],
        allowMultiSelection: false,
      });

      if (result) {
        console.log('Document selected:', result);

        // Add selected file to attachments list for UI
        const newAttachments = result.map(file => ({
          name: file.name,
          uri: file.uri,
          type: file.type,
          size: file.size,
        }));

        setSelectedAttachments(prev => [...prev, ...newAttachments]);

        // Create file data for upload
        const fileData = {
          uri:
            Platform.OS === 'android'
              ? result[0].uri
              : result[0].uri.replace('file://', ''),
          type: result[0].type || 'application/pdf',
          name: result[0].name || 'file.pdf',
        };

        console.log('File Data:', fileData);

        // Create FormData for upload
        const newFormData = new FormData();
        newFormData.append('file', fileData);

        console.log('FormData Object:', newFormData);

        // Save FormData for later upload
        setFormData(newFormData);
      }
    } catch (err) {
      console.log('User cancelled document picker or error:', err);
      if (err.code !== 'DOCUMENT_PICKER_CANCELED') {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to select attachment');
      }
    }
  };

  const uploadAttachment = async () => {
    if (!formData) {
      console.log('No attachment to upload');
      return null;
    }

    try {
      console.log('Uploading attachment...');

      const Token = await AsyncStorage.getItem('Token');

      const url = `/uploads`; // Adjust this to match your API endpoint

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      console.log('Upload status code:', response.status);

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${responseData.message || 'Unknown error'}`,
        );
      }

      console.log('Upload successful:', responseData.url);
      return responseData.url;
    } catch (error) {
      console.error('Error during file upload:', error.message);
      Alert.alert('Error', 'Failed to upload attachment');
      return null;
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && selectedAttachments.length === 0) return;

    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Upload attachment if exists
      let attachmentUrls = [];

      if (formData) {
        const uploadedUrl = await uploadAttachment();
        if (uploadedUrl) {
          attachmentUrls = Array.isArray(uploadedUrl)
            ? uploadedUrl
            : [uploadedUrl];
        }
      }

      // Create a temporary message object for immediate UI update
      const newMessageObj = {
        sender: teacherId,
        senderName:
          initialConversation.sender === teacherId
            ? initialConversation.senderName
            : initialConversation.receiverName,
        senderType: 'TEACHER',
        content: messageContent,
        timestamp: new Date().toISOString(),
        attachmentUrls: attachmentUrls,
      };

      // Add to messages list for instant feedback
      setMessages(prevMessages => [...prevMessages, newMessageObj]);

      // Clear attachments and form data
      setSelectedAttachments([]);
      setFormData(null);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);

      const Token = await AsyncStorage.getItem('Token');
      const url = `messages/${conversationId}/reply`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const data = {
        content: messageContent,
        sender: teacherId,
        senderName:
          initialConversation.sender === teacherId
            ? initialConversation.senderName
            : initialConversation.receiverName,
        senderType: 'TEACHER',
        timestamp: new Date().toISOString(),
        attachmentUrls: attachmentUrls,
      };

      const onResponse = res => {
        console.log('Message sent successfully:', res);
        setSendingMessage(false);
      };

      const onCatch = err => {
        console.error('Error sending message:', err);
        setSendingMessage(false);

        // Show error to user
        Alert.alert('Error', 'Failed to send message. Please try again.');

        // Optional: You could remove the temporary message and restore the text input
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg !== newMessageObj),
        );
        setNewMessage(messageContent);
      };

      patchApi(url, headers, data, onResponse, onCatch);
    } catch (error) {
      console.error('Exception when sending message:', error);
      setSendingMessage(false);
      Alert.alert(
        'Error',
        'An unexpected error occurred while sending message.',
      );
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
          ]}>
          <Text style={styles.messageContent}>{item.content}</Text>

          {/* Display attachments */}
          {item.attachmentUrls && item.attachmentUrls.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {item.attachmentUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.attachment}
                  onPress={() => handleOpenAttachment(url)}>
                  <MaterialIcons name="attachment" size={20} color="#001d3d" />
                  <Text style={styles.attachmentText}>
                    {typeof url === 'string'
                      ? url.split('/').pop()
                      : url.name || 'Attachment'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Display timestamp */}
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  const handleOpenAttachment = url => {
    // In a real app, this would open the attachment
    console.log('Opening attachment:', url);
    Alert.alert(
      'Opening Attachment',
      typeof url === 'string' ? url.split('/').pop() : url.name || 'Attachment',
    );
  };

  const handleRemoveAttachment = index => {
    const newAttachments = [...selectedAttachments];
    newAttachments.splice(index, 1);
    setSelectedAttachments(newAttachments);

    // If no attachments left, clear formData
    if (newAttachments.length === 0) {
      setFormData(null);
    }
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
          <Text style={styles.conversationSubject}>
            {initialConversation.sender === teacherId
              ? initialConversation.receiverName
              : initialConversation.senderName}
          </Text>
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
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              deeplink && conversationId ? getMessageById(conversationId) : null
            }>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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

      {selectedAttachments.length > 0 && (
        <View style={styles.selectedAttachmentsContainer}>
          <FlatList
            data={selectedAttachments}
            horizontal
            renderItem={({item, index}) => (
              <View style={styles.selectedAttachment}>
                <Text style={styles.selectedAttachmentText} numberOfLines={1}>
                  {item.name ||
                    (typeof item === 'string'
                      ? item.split('/').pop()
                      : 'Attachment')}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
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
            ((newMessage.trim() === '' && selectedAttachments.length === 0) ||
              sendingMessage) &&
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#001d3d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#001d3d',
    marginBottom: 3,
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
