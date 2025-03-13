// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   StatusBar,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {getapi} from '../utils/api';

// const ConversationScreen = ({route, navigation}) => {
//   const {studentId, studentName, profilePicUrl} = route.params;
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [keyboardVisible, setKeyboardVisible] = useState(false);
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true);
//         scrollToBottom();
//       },
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false);
//       },
//     );

//     fetchMessages();

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const fetchMessages = () => {
//     // Mock data - replace with actual API call
//     const mockMessages = [
//       {
//         id: '1',
//         senderId: studentId,
//         text: 'Good morning sir, how are you?',
//         timestamp: new Date(2025, 1, 16, 9, 0),
//         status: 'read',
//       },
//       {
//         id: '2',
//         senderId: 'teacher',
//         text: "Good morning! I'm doing well, thank you. How can I help you today?",
//         timestamp: new Date(2025, 1, 16, 9, 5),
//         status: 'read',
//       },
//       {
//         id: '3',
//         senderId: studentId,
//         text: "Sir, I wanted to ask about the assignment that's due tomorrow",
//         timestamp: new Date(2025, 1, 16, 9, 10),
//         status: 'read',
//       },
//       {
//         id: '4',
//         senderId: 'teacher',
//         text: 'Yes, what about it? Are you having any difficulties?',
//         timestamp: new Date(2025, 1, 16, 9, 12),
//         status: 'read',
//       },
//       {
//         id: '5',
//         senderId: studentId,
//         text: "I'm struggling with the third question. Could you give me a hint?",
//         timestamp: new Date(2025, 1, 16, 9, 15),
//         status: 'read',
//       },
//       {
//         id: '6',
//         senderId: 'teacher',
//         text: 'For the third question, try using the formula we discussed in class last week. Remember to apply it step by step.',
//         timestamp: new Date(2025, 1, 16, 9, 20),
//         status: 'read',
//       },
//       {
//         id: '7',
//         senderId: studentId,
//         text: 'Oh, I see! Thank you, sir. One more question - will we have a test next week?',
//         timestamp: new Date(2025, 1, 16, 14, 0),
//         status: 'read',
//       },
//       {
//         id: '8',
//         senderId: 'teacher',
//         text: "Yes, we'll have a short quiz on Monday covering the topics from this week.",
//         timestamp: new Date(2025, 1, 16, 14, 10),
//         status: 'read',
//       },
//       {
//         id: '9',
//         senderId: studentId,
//         text: "I'll make sure to prepare well. Thank you for your help!",
//         timestamp: new Date(2025, 1, 16, 14, 15),
//         status: 'read',
//       },
//       {
//         id: '10',
//         senderId: 'teacher',
//         text: "You're welcome! Let me know if you have any other questions.",
//         timestamp: new Date(2025, 1, 16, 14, 25),
//         status: 'delivered',
//       },
//       {
//         id: '11',
//         senderId: studentId,
//         text: 'Sir, I have completed the assignment',
//         timestamp: new Date(2025, 1, 16, 14, 30),
//         status: 'sent',
//       },
//     ];

//     setMessages(mockMessages);
//     setTimeout(scrollToBottom, 100);
//   };

//   const scrollToBottom = () => {
//     if (flatListRef.current && messages.length > 0) {
//       flatListRef.current.scrollToEnd({animated: true});
//     }
//   };

//   const sendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const message = {
//       id: (messages.length + 1).toString(),
//       senderId: 'teacher',
//       text: newMessage.trim(),
//       timestamp: new Date(),
//       status: 'sending',
//     };

//     setMessages([...messages, message]);
//     setNewMessage('');

//     // Simulate message being sent
//     setTimeout(() => {
//       setMessages(prevMessages =>
//         prevMessages.map(msg =>
//           msg.id === message.id ? {...msg, status: 'sent'} : msg,
//         ),
//       );

//       // Simulate message being delivered
//       setTimeout(() => {
//         setMessages(prevMessages =>
//           prevMessages.map(msg =>
//             msg.id === message.id ? {...msg, status: 'delivered'} : msg,
//           ),
//         );
//       }, 1000);
//     }, 500);

//     setTimeout(scrollToBottom, 100);
//   };

//   const formatTime = timestamp => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const renderMessageStatus = status => {
//     switch (status) {
//       case 'sending':
//         return <Ionicons name="time-outline" size={14} color="#8696a0" />;
//       case 'sent':
//         return <MaterialIcons name="done" size={14} color="#8696a0" />;
//       case 'delivered':
//         return <MaterialIcons name="done-all" size={14} color="#8696a0" />;
//       case 'read':
//         return <MaterialIcons name="done-all" size={14} color="#53bdeb" />;
//       default:
//         return null;
//     }
//   };

//   const renderMessage = ({item}) => {
//     const isSentByMe = item.senderId === 'teacher';

//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isSentByMe ? styles.sentContainer : styles.receivedContainer,
//         ]}>
//         <View
//           style={[
//             styles.messageBubble,
//             isSentByMe ? styles.sentBubble : styles.receivedBubble,
//           ]}>
//           <Text style={styles.messageText}>{item.text}</Text>
//           <View style={styles.messageFooter}>
//             <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
//             {isSentByMe && renderMessageStatus(item.status)}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   // Group messages by date
//   const renderMessageSeparator = date => (
//     <View style={styles.dateSeparator}>
//       <Text style={styles.dateSeparatorText}>{date}</Text>
//     </View>
//   );

//   const getMessageList = () => {
//     const result = [];
//     let currentDate = null;

//     messages.forEach(message => {
//       const messageDate = new Date(message.timestamp);
//       const formattedDate = messageDate.toLocaleDateString([], {
//         weekday: 'long',
//         month: 'long',
//         day: 'numeric',
//       });

//       if (formattedDate !== currentDate) {
//         result.push({
//           id: `date-${messageDate.getTime()}`,
//           type: 'date',
//           date: formattedDate,
//         });
//         currentDate = formattedDate;
//       }

//       result.push({
//         ...message,
//         type: 'message',
//       });
//     });

//     return result;
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.screen}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#001d3d" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.userInfo}
//           onPress={() => navigation.navigate('StudentProfile', {studentId})}>
//           {profilePicUrl ? (
//             <Image source={{uri: profilePicUrl}} style={styles.profilePic} />
//           ) : (
//             <View style={styles.defaultProfilePic}>
//               <Text style={styles.profileInitial}>
//                 {studentName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           )}
//           <View style={styles.nameStatus}>
//             <Text style={styles.userName}>{studentName}</Text>
//             <Text style={styles.userStatus}>Online</Text>
//           </View>
//         </TouchableOpacity>

//         <View style={styles.headerActions}>
//           <TouchableOpacity style={styles.headerButton}>
//             <Ionicons name="call-outline" size={22} color="#001d3d" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerButton}>
//             <MaterialIcons name="more-vert" size={22} color="#001d3d" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={getMessageList()}
//         renderItem={({item}) =>
//           item.type === 'date'
//             ? renderMessageSeparator(item.date)
//             : renderMessage({item})
//         }
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.messageList}
//         onContentSizeChange={scrollToBottom}
//       />

//       <View style={styles.inputContainer}>
//         <View style={styles.inputRow}>
//           <TouchableOpacity style={styles.attachButton}>
//             <MaterialIcons name="attach-file" size={24} color="#8696a0" />
//           </TouchableOpacity>
//           <View style={styles.textInputContainer}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Type a message"
//               value={newMessage}
//               onChangeText={setNewMessage}
//               multiline
//               placeholderTextColor="#8696a0"
//             />
//           </View>
//           <TouchableOpacity
//             style={styles.sendButton}
//             onPress={sendMessage}
//             disabled={newMessage.trim() === ''}>
//             {newMessage.trim() === '' ? (
//               <Ionicons name="mic" size={24} color="#8696a0" />
//             ) : (
//               <Ionicons name="send" size={20} color="#fff" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#efeae2',
//   },
//   header: {
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   userInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   defaultProfilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#128C7E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileInitial: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   nameStatus: {
//     marginLeft: 10,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#001d3d',
//   },
//   userStatus: {
//     fontSize: 12,
//     color: '#8696a0',
//   },
//   headerActions: {
//     flexDirection: 'row',
//   },
//   headerButton: {
//     marginLeft: 15,
//   },
//   messageList: {
//     paddingVertical: 10,
//   },
//   dateSeparator: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   dateSeparatorText: {
//     backgroundColor: '#e1f3fb',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     fontSize: 12,
//     color: '#4a6b82',
//   },
//   messageContainer: {
//     marginVertical: 2,
//     paddingHorizontal: 16,
//   },
//   sentContainer: {
//     alignItems: 'flex-end',
//   },
//   receivedContainer: {
//     alignItems: 'flex-start',
//   },
//   messageBubble: {
//     maxWidth: '80%',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   sentBubble: {
//     backgroundColor: '#dcf8c6',
//     borderTopRightRadius: 2,
//   },
//   receivedBubble: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 2,
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: 3,
//   },
//   messageTime: {
//     fontSize: 11,
//     color: '#8696a0',
//     marginRight: 4,
//   },
//   inputContainer: {
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     padding: 5,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   attachButton: {
//     padding: 10,
//   },
//   textInputContainer: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     borderRadius: 20,
//     marginHorizontal: 4,
//     paddingHorizontal: 12,
//     maxHeight: 100,
//   },
//   textInput: {
//     fontSize: 16,
//     color: '#000',
//     paddingVertical: 10,
//     maxHeight: 100,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: newMessage =>
//       newMessage.trim() === '' ? '#f0f2f5' : '#128C7E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ConversationScreen;

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
import {getapi, postapi} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

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

  const isFromCurrentUser = sender => {
    // Replace with actual logic to check if sender is current user
    // For demo purposes, assuming user@example.com is current user
    return sender === 'user3@example.com';
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && selectedAttachments.length === 0) return;

    setSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    // Create a new message
    const newMessageObj = {
      sender: 'user@example.com', // Replace with actual user email
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

      postapi(url, data, headers, onResponse, onCatch);
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
          <Text style={styles.conversationInfo}>
            with {conversation.sender} • {messages.length} messages
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
