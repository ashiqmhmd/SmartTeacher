import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getapi} from '../utils/api';
import dateconvert from '../components/moment';
import BatchSelectorSheet from '../components/BatchSelectorSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {batch_id, selectBatch} from '../utils/authslice';
import {useDispatch, useSelector} from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {useFocusEffect} from '@react-navigation/core';

const NotesScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  const selectedBatchString = useSelector(state => state.auth?.selectBatch);
  const selectedBatch_id = useSelector(state => state.auth?.batch_id);

  const refRBSheet = useRef();
  const dispatch = useDispatch();

  const handleBatchSelect = async batch => {
    await AsyncStorage.setItem('batch_id', batch.id.toString());
    await AsyncStorage.setItem('batch', JSON.stringify(batch));
    dispatch(batch_id(batch.id));
    dispatch(selectBatch(batch));
    await Notes_fetch();
    refRBSheet.current.close();
  };

  const Notes_fetch = async () => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');
    const Batch_id = await AsyncStorage.getItem('batch_id');

    const url = `/notes/batch/${Batch_id}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };
    const onResponse = res => {
      console.log('hiii');
      console.log(res);
      setNotes(res || []);
      setLoading(false);
      setRefreshing(false); // Stop refreshing after data is fetched
    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);
      setLoading(false);
      setRefreshing(false); // Stop refreshing on error
    };
    getapi(url, headers, onResponse, onCatch);
  };

  useEffect(() => {
    Notes_fetch();
    console.log(notes);
    console.log('notes fetch');
  }, [selectedBatchString]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused');
      Notes_fetch();
      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    Notes_fetch(); // Fetch data
  }, []);

  const NoteCard = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Note_Detail', {note: item})}
      style={styles.noteCard}>
      <View style={styles.noteTypeIcon}>
        <MaterialIcons name="description" size={24} color="#FF9800" />
      </View>
      <View style={styles.noteDetailsContainer}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.Title}
        </Text>
        <View style={styles.noteDetails}>
          <Text style={styles.noteContent} numberOfLines={2}>
            {item.content}
          </Text>
          <Text style={styles.noteDate}>{dateconvert(item.publishDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>

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
            {selectedBatchString?.name}
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
          {/* Search Bar Shimmer */}
          <View style={styles.searchSection}>
            <ShimmerPlaceholder style={styles.searchBar} />
          </View>

          {/* Student List Shimmer */}
          {[1, 2, 3, 4, 5].map((_, index) => (
            <View style={styles.noteCard}>
              <View key={index} style={styles.noteDetailsContainer}>
                <ShimmerPlaceholder style={styles.noteTitle} />
              </View>
              <View style={styles.noteDetails}>
                <ShimmerPlaceholder style={styles.noteContent} />
                <ShimmerPlaceholder style={styles.notesList} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Controlled by refreshing state
              onRefresh={onRefresh} // Callback when user pulls to refresh
              colors={['#001d3d']} // Customize refresh spinner color
              tintColor="#001d3d" // Customize spinner color (iOS)
            />
          }>
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={24} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search notes"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('Note_Create')}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {notes.length === 0 ? (
            <View style={styles.noNotesContainer}>
              <MaterialIcons name="description" size={48} color="#ccc" />
              <Text style={styles.noNotesText}>No notes in this batch</Text>
            </View>
          ) : (
            <FlatList
              data={notes}
              renderItem={({item}) => <NoteCard item={item} />}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              style={styles.notesList}
            />
          )}
        </ScrollView>
      )}
      <BatchSelectorSheet ref={refRBSheet} onBatchSelect={handleBatchSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.1,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#001d3d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesList: {
    paddingVertical: 20,
    paddingHorizontal: '5%',
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  noteDetailsContainer: {
    flex: 1,
    paddingRight: 5,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1F4B',
    marginBottom: 4,
  },
  noteDetails: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  noteContent: {
    flex: 1,
    color: '#666',
    fontSize: 12,
    marginRight: 8,
    lineHeight: 16,
  },
  noteDate: {
    fontSize: 10,
    color: '#666',
    flexShrink: 0,
    marginTop: 2,
  },
  noNotesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  noNotesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default NotesScreen;
