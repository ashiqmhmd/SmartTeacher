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
import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getapi} from '../utils/api';
import dateconvert from '../components/moment';

const AssignmentsScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignment, setAssignment] = useState([]);
  // Sample data for assignments
  const assignments = [
    {
      id: 1,
      title: 'Mathematics - Quadratic Equations',
      publishDate: '2025-02-01',
      dueDate: '2025-02-15',
      status: 'Active',
      submissionCount: 15,
      totalStudents: 31,
    },
    {
      id: 2,
      title: "Physics - Newton's Laws",
      publishDate: '2025-02-03',
      dueDate: '2025-02-17',
      status: 'Active',
      submissionCount: 8,
      totalStudents: 31,
    },
    {
      id: 3,
      title: 'Chemistry - Periodic Table',
      publishDate: '2025-01-25',
      dueDate: '2025-02-08',
      status: 'Completed',
      submissionCount: 28,
      totalStudents: 31,
    },
  ];

  const Assignment_fetch = () => {
    const url = 'assignments/batch/550e8400-e29b-41d4-a716-446655440000';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const onResponse = res => {
      console.log('assignment response');
      console.log(res);
      setAssignment(res);
    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);
    };
    getapi(url, headers, onResponse, onCatch);
  };

  useEffect(() => {
    Assignment_fetch();
    console.log(assignment);
    console.log('assignment fetch');
  }, [1]);

  const AssignmentCard = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Assignment_Edit', {assignment: item})}
      style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: item.status === 'Active' ? '#E3F2FD' : '#E8F5E9'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: item.status === 'Active' ? '#1976D2' : '#43A047'},
            ]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.assignmentDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="event" size={16} color="#666" />
          <Text style={styles.detailText}>Due: {dateconvert(item.submissionDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="people" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.submissionCount}/{item.totalStudents} Submitted
          </Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {width: `${(item.submissionCount / item.totalStudents) * 100}%`},
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assignments</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search assignments"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Assignment_Creation')}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assignmentsList}>
          <FlatList
            data={assignment}
            renderItem={({item}) => <AssignmentCard item={item} />}
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
    // paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
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
  assignmentsList: {
    paddingHorizontal: 20,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001d3d',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  assignmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});

export default AssignmentsScreen;
