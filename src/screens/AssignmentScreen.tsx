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
import {getapi} from '../utils/api';
import dateconvert from '../components/moment';
import BatchSelectorSheet from '../components/BatchSelectorSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {batch_id, selectBatch} from '../utils/authslice';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {useFocusEffect} from '@react-navigation/native';

const AssignmentsScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignment, setAssignment] = useState([]);
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
    await Assignment_fetch();
    refRBSheet.current.close();
  };

  const Assignment_fetch = async () => {
    setLoading(true);
    const Token = await AsyncStorage.getItem('Token');
    const Batch_id = await AsyncStorage.getItem('batch_id');
    const url = `assignments/batch/${Batch_id}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };
    const onResponse = res => {
      setAssignment(res || []);
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

  const getStatusColor = submissionDate => {
    if (!submissionDate || isNaN(new Date(submissionDate).getTime())) {
      return '#e53935'; // Red for invalid or missing dates
    }
    return new Date() < new Date(submissionDate)
      ? true // Green if current date is before submissionDate
      : false; // Red if current date is after or equal to submissionDate
  };

  useEffect(() => {
    Assignment_fetch();
  }, [selectedBatchString]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused');
      Assignment_fetch();
      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    Assignment_fetch(); // Fetch data
  }, []);

  const AssignmentCard = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Assignment_Detail', {assignment: item})
      }
      style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.submissionDate)
                ? '#E8F5E9'
                : '#ffb5a7',
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              {
                color: getStatusColor(item.submissionDate)
                  ? '#43A047'
                  : '#e53935',
              },
            ]}>
            {new Date() > new Date(item.submissionDate) ? 'Expired' : 'Active'}
          </Text>
        </View>
      </View>
      <View style={styles.assignmentDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="event" size={16} color="#666" />
          <Text style={styles.submissionDate}>
            Due: {dateconvert(item.submissionDate)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.publishDate}>
            {dateconvert(item.publishdate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assignments</Text>

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
            <View style={styles.assignmentCard}>
              <View key={index} style={styles.assignmentHeader}>
                <ShimmerPlaceholder style={styles.assignmentTitle} />
              </View>
              <View style={styles.assignmentDetails}>
                <ShimmerPlaceholder style={styles.detailItem} />
                <ShimmerPlaceholder style={styles.detailItem} />
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
                placeholder="Search assignments"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                navigation.navigate('Assignment_Creation', {update: false})
              }>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {assignment.length === 0 ? (
            <View style={styles.noAssignmentsContainer}>
              <MaterialIcons name="assignment" size={48} color="#ccc" />
              <Text style={styles.noAssignmentsText}>
                No assignments in this batch
              </Text>
            </View>
          ) : (
            <FlatList
              data={assignment}
              renderItem={({item}) => <AssignmentCard item={item} />}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              style={styles.assignmentsList}
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
  assignmentsList: {
    paddingVertical: 20,
    paddingHorizontal: '5%',
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 15,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 15,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
    fontSize: 10,
    fontWeight: '500',
  },
  assignmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  submissionDate: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  publishDate: {
    marginLeft: 5,
    color: '#666',
    fontSize: 10,
  },
  noAssignmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  noAssignmentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default AssignmentsScreen;
