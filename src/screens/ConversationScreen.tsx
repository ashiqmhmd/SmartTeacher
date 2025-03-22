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
import {base_url} from '../utils/store';

const ConversationScreen = ({route, navigation}) => {
  const {deeplink, conversationId} = route?.params;
  const [createmessage, setcreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [TeacherName, setTeacherName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [formData, setFormData] = useState(null);
  const [conversationData, setConversationData] = useState(null);
  const [student, setstudent] = useState([]);
  const flatListRef = useRef(null);
  const loadUserData = async () => {
    try {
      const id = (await AsyncStorage.getItem('TeacherId')) || '';
      const username = (await AsyncStorage.getItem('TeacherName')) || '';
      setTeacherId(id);
      setTeacherName(username);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  };

  useEffect(() => {
    const studentData = route?.params?.student;
    const create = route?.params?.create;
    setstudent(studentData);
    setcreate(create);
    TeacherDetails();
  }, [route?.params?.create && route?.params?.student]);

  useEffect(() => {
    loadUserData();
    if (conversationId) {
      console.log('Loading conversation with ID:', conversationId);
      getMessageById(conversationId);
    } else {
      setError('No conversation data provided');
    }

    if (flatListRef.current && messages.length > 0) {
      if (Platform.OS === 'android') {
        flatListRef.current.scrollToOffset({
          offset: 99999,
          animated: false,
        });
      } else {
        flatListRef.current.scrollToEnd({animated: false});
      }
    }
  }, [conversationId]);

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
          // Store the full conversation data for later use
          setConversationData(res);

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

      if (result && result.length > 0) {
        console.log('Document selected:', result);
        const selectedFile = result[0];

        // Create file data structure matching the assignment screen
        const fileData = {
          uri:
            Platform.OS === 'android'
              ? selectedFile.uri
              : selectedFile.uri.replace('file://', ''),
          type: selectedFile.type || 'application/pdf',
          name: selectedFile.name || 'file.pdf',
          size: selectedFile.size,
        };

        console.log('File Data:', fileData);

        // Store the selected file in the state - this is what we'll use to upload
        setSelectedAttachments([fileData]);

        // We don't need to create FormData here, that happens in uploadAttachment
        // Just set formData to a non-null value to indicate we have an attachment
        setFormData({});
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
    if (!formData || selectedAttachments.length === 0) {
      console.log('No attachment to upload');
      return null;
    }

    try {
      console.log('Uploading attachment...');

      const Token = await AsyncStorage.getItem('Token');
      const fileData = selectedAttachments[0]; // Get the file data from selected attachments

      // Create FormData - this is the key fix
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', fileData);

      const url = `${base_url}uploads`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToUpload,
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

      if (formData && selectedAttachments.length > 0) {
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
          conversationData?.sender === teacherId
            ? conversationData?.senderName
            : conversationData?.receiverName,
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
          conversationData?.sender === teacherId
            ? conversationData?.senderName
            : conversationData?.receiverName,
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

  const TeacherDetails = async () => {
    try {
      setLoading(true);

      const Token = await AsyncStorage.getItem('Token');
      if (!Token) {
        throw new Error('No token found, authentication required');
      }

      const url = `teachers/${teacherId}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const onResponse = res => {
        if (res) {
          setTeacherName(res.firstName + ' ' + res.lastName);
          console.log(res);
        }
        setLoading(false);
      };

      const onCatch = error => {
        console.error('API Error:', error);
        setLoading(false);
      };

      getapi(url, headers, onResponse, onCatch);
    } catch (error) {
      console.error('TeacherDetails Error:', error.message);
      setLoading(false);
    }
  };

  const Create_message = async () => {
    console.log(TeacherName);

    const Batch_id = await AsyncStorage.getItem('batch_id');
    if (newMessage.trim() === '' && selectedAttachments.length === 0) return;

    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Upload attachment if exists
      let attachmentUrls = [];

      if (formData && selectedAttachments.length > 0) {
        const uploadedUrl = await uploadAttachment();
        if (uploadedUrl) {
          attachmentUrls = Array.isArray(uploadedUrl)
            ? uploadedUrl
            : [uploadedUrl];
        }
      }

      // Create a temporary message object for immediate UI update
      const newMessageObj = {
        subject: 'just chat',
        sender: teacherId,
        senderName: TeacherName,
        senderType: 'TEACHER',
        content: messageContent,
        timestamp: new Date().toISOString(),
        attachmentUrls: attachmentUrls,
        receiverName: student.userName,
        receiverType: 'STUDENT',
        receiver: student.id,
        batchId: Batch_id,
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
      const url = `messages`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const data = {
        subject: 'just chat',
        sender: teacherId,
        senderName: TeacherName,
        senderType: 'TEACHER',
        content: messageContent,
        timestamp: new Date().toISOString(),
        attachmentUrls: attachmentUrls,
        receiverName: student.userName,
        receiverType: 'STUDENT',
        receiver: student.id,
        batchId: Batch_id,
      };

      const onResponse = res => {
        console.log('Message Created successfully:', res);
        setSendingMessage(false);

        // Show success notification
        setShowSuccess(true);

        // Update the conversation with the actual message ID from the server response
        if (res && res.id) {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg === newMessageObj ? {...msg, id: res.id} : msg,
            ),
          );

          // Navigate to the conversation view with the new conversation ID
          setTimeout(() => {
            navigation.replace('Chat', {
              conversationId: res.id,
              student: student,
              create: false,
            });
          }, 1500);
        }

        // Hide success notification after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
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

      postApi(url, headers, data, onResponse, onCatch);
    } catch (error) {
      console.error('Exception when sending message:', error);
      setSendingMessage(false);
      Alert.alert(
        'Error',
        'An unexpected error occurred while sending message.',
      );
    }
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
            {createmessage
              ? student.userName
              : conversationData?.sender === teacherId
              ? conversationData?.receiverName
              : conversationData?.senderName}
          </Text>
        </View>
        <TouchableOpacity onPress={() => console.log('More options')}>
          <MaterialIcons name="more-vert" size={28} color="#001d3d" />
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <View style={styles.successNotification}>
          <MaterialIcons name="check-circle" size={24} color="#fff" />
          <Text style={styles.successNotificationText}>
            Message sent successfully
          </Text>
          <TouchableOpacity onPress={() => setShowSuccess(false)}>
            <MaterialIcons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#001d3d" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : createmessage ? (
        <FlatList
          ref={flatListRef}
          data={messages.length > 0 ? groupMessagesByDate() : []}
          renderItem={renderItem}
          keyExtractor={item => item.id || `temp-${Math.random()}`}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={() => (
            <View style={styles.emptyConversationContainer}>
              <MaterialCommunityIcons
                name="chat-outline"
                size={60}
                color="#bdbdbd"
              />
              <Text style={styles.emptyConversationText}>
                Start a conversation with {student.userName}
              </Text>
              <Text style={styles.emptyConversationSubtext}>
                Send a message to begin chatting
              </Text>
            </View>
          )}
          onLayout={() => {
            if (messages.length > 0 && flatListRef.current) {
              flatListRef.current.scrollToEnd({animated: false});
            }
          }}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              conversationId ? getMessageById(conversationId) : null
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
          onLayout={() =>
            flatListRef.current.scrollToOffset({
              offset: Number.MAX_VALUE,
              animated: false,
            })
          }
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
          onPress={() => (createmessage ? Create_message() : sendMessage())}>
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
  emptyConversationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 300,
  },
  emptyConversationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001d3d',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyConversationSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  successNotification: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successNotificationText: {
    color: '#fff',
    flex: 1,
    marginLeft: 10,
    fontWeight: '500',
  },
});
