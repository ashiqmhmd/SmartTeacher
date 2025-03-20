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
  RefreshControl, // Add RefreshControl
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getapi} from '../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import BatchSelectorSheet from '../components/BatchSelectorSheet';
import {batch_id, selectBatch} from '../utils/authslice';

const ChatsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  const selectedBatch_id = useSelector(state => state.auth?.batch_id);
  const selectedBatchString = useSelector(state => state.auth?.selectBatch);

  const refRBSheet = useRef();
  const dispatch = useDispatch();

  const handleBatchSelect = async batch => {
    await AsyncStorage.setItem('batch_id', batch.id.toString());
    await AsyncStorage.setItem('batch', JSON.stringify(batch));

    dispatch(batch_id(batch.id));
    dispatch(selectBatch(batch));

    // Close the bottom sheet
    refRBSheet.current.close();
  };

  const fetchConversations = async () => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');
    const Batch_id = await AsyncStorage.getItem('batch_id');
    const Teacher_id = await AsyncStorage.getItem('TeacherId');
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
      setRefreshing(false); // Stop refreshing after data is fetched
    };

    const onCatch = err => {
      console.log('Error fetching conversations:', err);
      setLoading(false);
      setRefreshing(false); // Stop refreshing on error
    };

    getapi(url, headers, onResponse, onCatch);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    fetchConversations(); // Fetch data
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>

        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={{
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#e0e0e0',
          }}>
          <Text style={{color: '#001d3d', fontWeight: 'bold', fontSize: 16}}>
            {selectedBatch_id ? selectedBatchString?.name : 'Select Batch'}
          </Text>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={20}
            color="#001d3d"
            style={{paddingLeft: 5}}
          />
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing} // Controlled by refreshing state
                  onRefresh={onRefresh} // Callback when user pulls to refresh
                  colors={['#001d3d']} // Customize refresh spinner color
                  tintColor="#001d3d" // Customize spinner color (iOS)
                />
              }
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
      <BatchSelectorSheet ref={refRBSheet} onBatchSelect={handleBatchSelect} />
    </View>
  );
};
export default ChatsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#001d3d',
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
    marginTop: 20,
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
    elevation: 15,
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
    elevation: 12,
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
