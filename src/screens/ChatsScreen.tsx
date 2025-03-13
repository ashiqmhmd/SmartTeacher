// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   StatusBar,
//   TextInput,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {getapi} from '../utils/api';

// const ChatsScreen = ({navigation}) => {
//   const [chats, setChats] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredChats, setFilteredChats] = useState([]);

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredChats(chats);
//     } else {
//       const filtered = chats.filter(
//         chat =>
//           chat.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//       setFilteredChats(filtered);
//     }
//   }, [searchQuery, chats]);

//   const fetchChats = () => {
//     // Mock data - replace with actual API call
//     const mockChats = [
//       {
//         id: '1',
//         studentId: '101',
//         studentName: 'Rahul Sharma',
//         profilePicUrl: null,
//         lastMessage: 'Sir, I have completed the assignment',
//         timestamp: new Date(2025, 1, 16, 14, 30),
//         unreadCount: 2,
//       },
//       {
//         id: '2',
//         studentId: '102',
//         studentName: 'Priya Patel',
//         profilePicUrl: 'https://randomuser.me/api/portraits/women/41.jpg',
//         lastMessage: 'Thank you for the feedback!',
//         timestamp: new Date(2025, 1, 16, 10, 15),
//         unreadCount: 0,
//       },
//       {
//         id: '3',
//         studentId: '103',
//         studentName: 'Amit Kumar',
//         profilePicUrl: null,
//         lastMessage: 'When is the next class?',
//         timestamp: new Date(2025, 1, 15, 18, 45),
//         unreadCount: 1,
//       },
//       {
//         id: '4',
//         studentId: '104',
//         studentName: 'Neha Singh',
//         profilePicUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
//         lastMessage: "I missed today's class due to illness",
//         timestamp: new Date(2025, 1, 15, 9, 20),
//         unreadCount: 0,
//       },
//       {
//         id: '5',
//         studentId: '105',
//         studentName: 'Vikram Mehta',
//         profilePicUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
//         lastMessage: 'Can you share the notes for today?',
//         timestamp: new Date(2025, 1, 14, 19, 10),
//         unreadCount: 3,
//       },
//     ];

//     setChats(mockChats);
//     setFilteredChats(mockChats);
//   };

//   const formatTimestamp = timestamp => {
//     const now = new Date();
//     const messageDate = new Date(timestamp);

//     const isToday =
//       messageDate.getDate() === now.getDate() &&
//       messageDate.getMonth() === now.getMonth() &&
//       messageDate.getFullYear() === now.getFullYear();

//     if (isToday) {
//       return messageDate.toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } else {
//       return messageDate.toLocaleDateString([], {
//         month: 'short',
//         day: 'numeric',
//       });
//     }
//   };

//   const renderChatItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.chatItem}
//       onPress={() =>
//         navigation.navigate('Chat', {
//           studentId: item.studentId,
//           studentName: item.studentName,
//           profilePicUrl: item.profilePicUrl,
//         })
//       }>
//       <View style={styles.profileContainer}>
//         {item.profilePicUrl ? (
//           <Image source={{uri: item.profilePicUrl}} style={styles.profilePic} />
//         ) : (
//           <View style={styles.defaultProfilePic}>
//             <Text style={styles.profileInitial}>
//               {item.studentName.charAt(0).toUpperCase()}
//             </Text>
//           </View>
//         )}
//         {item.unreadCount > 0 && (
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.chatInfo}>
//         <View style={styles.nameTimeRow}>
//           <Text style={styles.studentName} numberOfLines={1}>
//             {item.studentName}
//           </Text>
//           <Text style={styles.timestamp}>
//             {formatTimestamp(item.timestamp)}
//           </Text>
//         </View>
//         <View style={styles.messageRow}>
//           <Text
//             style={[
//               styles.lastMessage,
//               item.unreadCount > 0 ? styles.unreadMessage : null,
//             ]}
//             numberOfLines={1}>
//             {item.lastMessage}
//           </Text>
//           {item.unreadCount > 0 ? (
//             <MaterialIcons name="done" size={16} color="#8696a0" />
//           ) : (
//             <MaterialIcons name="done-all" size={16} color="#53bdeb" />
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.screen}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Chats</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
//           <MaterialIcons name="message" size={24} color="#001d3d" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchSection}>
//         <View style={styles.searchBar}>
//           <Ionicons name="search" size={20} color="#666" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search chats"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#666"
//           />
//         </View>
//       </View>

//       {filteredChats.length > 0 ? (
//         <FlatList
//           data={filteredChats}
//           renderItem={renderChatItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.chatList}
//         />
//       ) : (
//         <View style={styles.emptyChats}>
//           <MaterialIcons name="chat-bubble-outline" size={60} color="#ccc" />
//           <Text style={styles.emptyChatsText}>No chats found</Text>
//           <Text style={styles.emptyChatsSubText}>
//             Start a new conversation by tapping the message icon above
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     paddingTop: 10,
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#001d3d',
//   },
//   searchSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderColor: '#e0e0e0',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#333',
//   },
//   chatList: {
//     paddingVertical: 8,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   profileContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   profilePic: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   defaultProfilePic: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#128C7E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileInitial: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   unreadBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: '#25D366',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   unreadCount: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   chatInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   nameTimeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   studentName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     maxWidth: '70%',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#8696a0',
//   },
//   messageRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#8696a0',
//     maxWidth: '90%',
//   },
//   unreadMessage: {
//     color: '#000',
//     fontWeight: '500',
//   },
//   emptyChats: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyChatsText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginTop: 20,
//   },
//   emptyChatsSubText: {
//     fontSize: 14,
//     color: '#8696a0',
//     textAlign: 'center',
//     marginTop: 10,
//     maxWidth: '80%',
//   },
// });

// export default ChatsScreen;

import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getapi} from '../utils/api';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const ChatsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedBatch_id = useSelector(state => state.auth?.batch_id);

  const fetchConversations = async () => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');
    const Batch_id = await AsyncStorage.getItem('batch_id');
    // const url = `messages/batch/${Batch_id ? Batch_id : selectedBatch_id}`;
    const url = `messages/batch/a8f0c784-687f-4fa3-bd72-2fbdbe89c7d0`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };
    const onResponse = res => {
      setConversations(res);
      setLoading(false);
    };

    const onCatch = err => {
      console.log('Error fetching conversations:', err);
      setLoading(false);
    };

    getapi(url, headers, onResponse, onCatch);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // If it's earlier, show the date
    return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  const getLastMessage = conversation => {
    if (conversation.replies && conversation.replies.length > 0) {
      return conversation.replies[conversation.replies.length - 1].content;
    }
    return conversation.content;
  };

  const getLastMessageTime = conversation => {
    if (conversation.replies && conversation.replies.length > 0) {
      return formatDate(
        conversation.replies[conversation.replies.length - 1].timestamp,
      );
    }
    return formatDate(conversation.timestamp);
  };

  const filteredConversations = conversations.filter(
    conversation =>
      conversation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLastMessage(conversation)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const renderConversationItem = ({item}) => {
    const lastMessage = getLastMessage(item);
    const lastMessageTime = getLastMessageTime(item);
    const hasAttachments =
      item.attachmentUrls && item.attachmentUrls.length > 0;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('Chat', {conversation: item})}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.subject.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationSubject} numberOfLines={1}>
              {item.subject}
            </Text>
            <Text style={styles.conversationTime}>{lastMessageTime}</Text>
          </View>
          <View style={styles.messagePreviewContainer}>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {lastMessage}
            </Text>
            {hasAttachments && (
              <Ionicons
                name="attach"
                size={16}
                color="#888"
                style={styles.attachmentIcon}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            style={styles.avatarImg}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/5310/5310895.png',
            }}
          />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <View style={styles.notificationIcon}>
            <Ionicons
              name="notifications-outline"
              size={30}
              color="rgb(0,0,0)"
            />
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <ShimmerPlaceholder style={styles.searchBarShimmer} />
          </View>

          {[1, 2, 3, 4, 5].map((_, index) => (
            <View key={index} style={styles.conversationCardShimmer}>
              <ShimmerPlaceholder style={styles.avatarShimmer} />
              <View style={styles.conversationDetailsShimmer}>
                <View style={styles.conversationHeaderShimmer}>
                  <ShimmerPlaceholder style={styles.subjectShimmer} />
                  <ShimmerPlaceholder style={styles.timeShimmer} />
                </View>
                <ShimmerPlaceholder style={styles.previewShimmer} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={24} color="#666" />
              <TextInput
                placeholder="Search messages"
                placeholderTextColor="#666"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.composeButton}
              onPress={() => navigation.navigate('ComposeMessage')}>
              <MaterialIcons name="edit" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {filteredConversations.length > 0 ? (
            <FlatList
              data={filteredConversations}
              renderItem={renderConversationItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="mark-email-unread"
                size={80}
                color="#E5EBFC"
              />
              <Text style={styles.emptyText}>No messages found</Text>
              {searchQuery.length > 0 ? (
                <Text style={styles.emptySubtext}>
                  Try a different search term
                </Text>
              ) : (
                <Text style={styles.emptySubtext}>
                  Start a new conversation
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  appBar: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#001d3d',
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(216, 224, 247)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    flex: 1,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: 'rgb(51,51,51)',
    flex: 1,
  },
  composeButton: {
    backgroundColor: '#001d3d',
    padding: 13,
    borderRadius: 25,
    marginLeft: 10,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  list: {
    paddingHorizontal: '5%',
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#001d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  conversationSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  attachmentIcon: {
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001d3d',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  // Shimmer styles
  searchBarShimmer: {
    height: 50,
    borderRadius: 25,
    width: '100%',
  },
  conversationCardShimmer: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
  },
  avatarShimmer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationDetailsShimmer: {
    flex: 1,
  },
  conversationHeaderShimmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subjectShimmer: {
    width: '60%',
    height: 16,
    borderRadius: 4,
  },
  timeShimmer: {
    width: '25%',
    height: 12,
    borderRadius: 4,
  },
  previewShimmer: {
    width: '90%',
    height: 14,
    borderRadius: 4,
  },
});
