import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

const NotesScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for notes
  const notes = [
    {
      id: 1,
      title: 'Quadratic Equations - Complete Guide',
      type: 'PDF',
      createdAt: '2025-02-01',
      size: '2.5 MB',
      views: 45,
    },
    {
      id: 2,
      title: "Newton's Laws - Video Lecture",
      type: 'Video',
      createdAt: '2025-02-03',
      duration: '15:30',
      views: 32,
    },
    {
      id: 3,
      title: 'Periodic Table Overview',
      type: 'Text',
      createdAt: '2025-01-25',
      wordCount: '850 words',
      views: 67,
    },
    {
      id: 4,
      title: 'Chemical Bonding - Audio Explanation',
      type: 'Audio',
      createdAt: '2025-01-20',
      duration: '12:45',
      views: 28,
    },
  ];

  const getIconForType = type => {
    switch (type) {
      case 'PDF':
        return (
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={24}
            color="#F44336"
          />
        );
      case 'Video':
        return <MaterialIcons name="videocam" size={24} color="#2196F3" />;
      case 'Audio':
        return <MaterialIcons name="audiotrack" size={24} color="#4CAF50" />;
      default:
        return <MaterialIcons name="description" size={24} color="#FF9800" />;
    }
  };

  const NoteCard = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NoteDetails', {note: item})}
      style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <View style={styles.noteTypeIcon}>{getIconForType(item.type)}</View>
        <View style={styles.noteTitleContainer}>
          <Text style={styles.noteTitle}>{item.title}</Text>
          <Text style={styles.noteDate}>{item.createdAt}</Text>
        </View>
      </View>
      <View style={styles.noteDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="description" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.type === 'PDF'
              ? item.size
              : item.type === 'Text'
              ? item.wordCount
              : item.duration}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="visibility" size={16} color="#666" />
          <Text style={styles.detailText}>{item.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notes"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateNote')}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesList}>
          <FlatList
            data={notes}
            renderItem={({item}) => <NoteCard item={item} />}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F1F4B',
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
    backgroundColor: '#f7f7f7',
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
    backgroundColor: '#0F1F4B',
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
    paddingHorizontal: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: 'rgb(19, 79, 243)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteTitleContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1F4B',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  noteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 52,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
});

export default NotesScreen;
