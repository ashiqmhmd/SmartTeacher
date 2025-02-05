import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../components/BottomNavBar';
import {batchDetails, students} from '../dumyDb';

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

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.homeScreen}>
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
            <View style={styles.hexagonWrapper}>
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
            </View>
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
            <Ionicons name="search" size={20} color="rgb(153,153,153)" />
            <TextInput
              placeholder="Search Student"
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
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
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
  },
  batchCardSubtitle: {
    fontSize: 14,
    color: 'rgb(102,102,102)',
  },
  batchCardCount: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
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
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.3,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    color: 'rgb(51,51,51)',
  },
  addStudentButton: {
    backgroundColor: 'rgb(53, 104, 244)',
    padding: 10,
    borderRadius: 10,
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
});
