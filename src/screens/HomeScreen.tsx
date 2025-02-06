import {
  Alert,
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
import React, {useCallback, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../components/BottomNavBar';
import {batchDetails, batches, students} from '../dumyDb';
import RBSheet from 'react-native-raw-bottom-sheet';

const HomeScreen = ({navigation}) => {
  const refRBSheet = useRef();
  const [selectedBatch, setSelectedBatch] = useState(batchDetails);

  // // Function to Open Bottom Sheet
  // const handleOpenBottomSheet = useCallback(() => {
  //   bottomSheetRef.current?.expand();
  // }, []);

  const renderStudentCard = ({item}) => (
    <TouchableOpacity style={styles.listCard}>
      <Image source={{uri: item.profilePicUrl}} style={styles.profilePic} />
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.studentName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.parentDtl}>Parent: {item.parent1Name}</Text>
        <Text style={styles.parentDtl}>Phone No: {item.parent1Phone}</Text>
      </View>
      {/* <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="message" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  );

  const BatchItem = ({item, onSelect}) => (
    <TouchableOpacity
      style={[
        styles.batchItem,
        selectedBatch.name === item.name && styles.selectedBatchItem,
      ]}
      onPress={() => onSelect(item)}>
      <View style={styles.batchItemContent}>
        <View style={styles.batchItemLeft}>
          <View style={styles.batchIcon}>
            <MaterialCommunityIcons
              name="book-education"
              size={24}
              color={selectedBatch.name === item.name ? '#fff' : '#0F1F4B'}
            />
          </View>
          <View style={styles.batchInfo}>
            <Text
              style={[
                styles.batchName,
                selectedBatch.name === item.name && styles.selectedText,
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.batchSubject,
                selectedBatch.name === item.name && styles.selectedSubText,
              ]}>
              {item.subject}
            </Text>
          </View>
        </View>
        <View style={styles.batchItemRight}>
          <View style={styles.scheduleInfo}>
            <Text
              style={[
                styles.scheduleText,
                selectedBatch.name === item.name && styles.selectedSubText,
              ]}>
              {item.schedule}
            </Text>
            <Text
              style={[
                styles.timeText,
                selectedBatch.name === item.name && styles.selectedSubText,
              ]}>
              {item.time}
            </Text>
          </View>
          {selectedBatch.name === item.name && (
            <MaterialIcons name="check-circle" size={24} color="#fff" />
          )}
        </View>
      </View>
      <View style={styles.studentCount}>
        <MaterialIcons
          name="people"
          size={16}
          color={selectedBatch.name === item.name ? '#fff' : '#666'}
        />
        <Text
          style={[
            styles.studentCountText,
            selectedBatch.name === item.name && styles.selectedSubText,
          ]}>
          {item.studentCount} Students
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleBatchSelect = batch => {
    setSelectedBatch(batch);
    refRBSheet.current.close();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <View>
          <Image
            style={styles.avatarImg}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/5310/5310895.png',
            }}
          />
        </View>
        <Text style={styles.appBarTitle}>Smart Teacher</Text>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={30} color="rgb(0,0,0)" />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.batchCard}>
          <LinearGradient
            colors={['rgb(255,255,255)', 'rgb(229,235,252)']} // Light gradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={styles.hexagonWrapper}>
              <LinearGradient
                colors={['rgb(255,255,255)', 'rgb(247,248,252)']} // Same as card to blend in
                style={styles.hexagon}>
                <MaterialIcons
                  name="change-circle"
                  size={24}
                  color="rgb(105,103,103)"
                  style={styles.hexagonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.batchCardTitle}>{batchDetails.name}</Text>
            <Text style={styles.batchCardSubtitle}>{batchDetails.subject}</Text>
            <Text style={styles.batchCardCount}>31</Text>
            <View style={styles.createBatch}>
              <TouchableOpacity style={styles.createBatchButton}>
                <Text style={styles.createBatchButtonText}>
                  Create New Batch
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#666" />
            <TextInput
              placeholder="Search Student"
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            style={styles.addStudentButton}
            accessibilityLabel="Add new student"
            onPress={() =>
              Alert.alert('Add Student', 'Functionality to be implemented')
            }>
            <Text style={styles.addStudentButtonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.listTitle}>Students In Batch</Text> */}

        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={500}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: '#D1D5DB',
            width: 60,
          },
        }}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Select Batch</Text>
          <View style={styles.searchBarSheet}>
            <Ionicons name="search" size={20} color="rgb(153,153,153)" />
            <TextInput
              placeholder="Search batches"
              style={styles.searchInputSheet}
            />
          </View>
          <FlatList
            data={batches}
            renderItem={({item}) => (
              <BatchItem item={item} onSelect={handleBatchSelect} />
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.batchList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </RBSheet>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  appBar: {
    // paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    color: 'rgb(15, 31, 75)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgb(216, 224, 247)',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  batchCard: {
    width: '90%',
    height: 130,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    shadowColor: 'rgb(105, 144, 252)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 20,
    marginHorizontal: '5%',
  },
  batchCardTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 20,
  },
  batchCardSubtitle: {
    fontSize: 14,
    color: 'rgb(102,102,102)',
    paddingLeft: 20,
  },
  batchCardCount: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
    paddingLeft: 20,
  },
  card: {
    // width: 150,
    height: '100%',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  hexagonWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
  },
  hexagon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    transform: [{rotate: '45deg'}, {translateX: -10}, {translateY: -10}],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgb(155, 178, 245)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  hexagonIcon: {
    paddingTop: 10,
    paddingRight: 5,
    transform: [{rotate: '-45deg'}],
  },
  createBatch: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    color: 'white',
  },
  createBatchButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderColor: 'rgb(141, 165, 233)',
  },
  createBatchButtonText: {
    fontSize: 12,
    color: 'rgb(118, 149, 233)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.1,
    borderRadius: 25,
    paddingHorizontal: 15,
    flex: 1,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: 'rgb(51,51,51)',
  },
  addStudentButton: {
    // backgroundColor: 'rgb(53, 104, 244)',
    backgroundColor: 'rgb(34, 78, 200)',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginLeft: 10,
  },
  addStudentButtonText: {
    color: 'rgb(255,255,255)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0,0,0)',
    marginBottom: 10,
  },
  list: {
    padding: 3,
    marginHorizontal: '5%',
  },
  listCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgb(105, 144, 252)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  studentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  parentDtl: {
    fontSize: 12,
    color: 'rgb(162, 160, 160)',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1F4B',
    marginBottom: 16,
  },
  searchBarSheet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInputSheet: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  batchList: {
    paddingBottom: 20,
  },
  batchItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedBatchItem: {
    backgroundColor: '#0F1F4B',
    borderColor: '#0F1F4B',
  },
  batchItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  batchInfo: {
    flex: 1,
  },
  batchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1F4B',
    marginBottom: 4,
  },
  batchSubject: {
    fontSize: 14,
    color: '#666',
  },
  batchItemRight: {
    alignItems: 'flex-end',
  },
  scheduleInfo: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: '#0F1F4B',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  studentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  studentCountText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  selectedText: {
    color: '#fff',
  },
  selectedSubText: {
    color: '#E5E7EB',
  },
});
