import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getapi} from '../utils/api';
import dateconvert from '../components/moment';
import BatchSelectorSheet from '../components/BatchSelectorSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {batch_id, selectBatch} from '../utils/authslice';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const AssignmentsScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedBatchString = useSelector(state => state.auth?.selectBatch);
  const refRBSheet = useRef();
  const dispatch = useDispatch();

  const handleBatchSelect = async batch => {
    await AsyncStorage.removeItem('batch_id');
    dispatch(batch_id(batch.id)),
      await AsyncStorage.setItem('batch', JSON.stringify(batch));
    refRBSheet.current.close(); // Store full batch object
    dispatch(selectBatch(JSON.stringify(batch))); // Update Redux state
    await Assignment_fetch();
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
      setAssignment(res);
      setLoading(false);
    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);
      setLoading(false);
    };
    getapi(url, headers, onResponse, onCatch);
  };

  const selectedBatch = useMemo(() => {
    Assignment_fetch();
    return selectedBatchString ? JSON.parse(selectedBatchString) : null;
  }, [selectedBatchString]);

  useEffect(() => {
    Assignment_fetch();
  }, [1]);

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
            {backgroundColor: item.status === 'Active' ? '#E8F5E9' : '#ffb5a7'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  Date() < dateconvert(item.submissionDate)
                    ? '#43A047'
                    : '#e53935',
              },
            ]}>
            {Date() < dateconvert(item.submissionDate) ? 'Active' : 'Expired'}
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
            // backgroundColor: '#f8f9fa',
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
            {selectedBatch?.name}
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

          <FlatList
            data={assignment}
            renderItem={({item}) => <AssignmentCard item={item} />}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            style={styles.assignmentsList}
          />
        </ScrollView>
      )}
      <BatchSelectorSheet
        ref={refRBSheet}
        selectedBatch={selectedBatch}
        onBatchSelect={handleBatchSelect}
      />
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
  batchSelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  batchButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: '5%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  batchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001d3d',
  },
  batchSubject: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  batchIcon: {
    marginLeft: 10,
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
});

export default AssignmentsScreen;
