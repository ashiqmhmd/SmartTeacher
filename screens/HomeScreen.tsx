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

const batchDetails = {
  subject: 'Algebra',
  paymentFrequency: 'Monthly',
  course: 'Mathematics',
  teacherId: '660e8400-e29b-41d4-a716-446655440001',
  description:
    'An introductory course to Algebra covering basic concepts and problem-solving techniques.',
  id: '212e46a9-9a1d-4906-a27e-5ef03e989955',
  paymentAmount: 150,
  name: 'Math 1012',
  paymentDayOfMonth: 15,
};

const students = [
  {
    id: '1',
    name: 'Angel M Thomas',
    profilePic: 'https://avatar.iran.liara.run/public/1',
  },
  {
    id: '2',
    name: 'Maria Manuel',
    profilePic: 'https://avatar.iran.liara.run/public/2',
  },
  {
    id: '3',
    name: 'Rahul Ravi',
    profilePic: 'https://avatar.iran.liara.run/public/3',
  },
  {
    id: '4',
    name: 'Ria Thomas',
    profilePic: 'https://avatar.iran.liara.run/public/4',
  },
  {
    id: '5',
    name: 'Rohan Ram',
    profilePic: 'https://avatar.iran.liara.run/public/5',
  },
  {
    id: '6',
    name: 'Shyam Suhas',
    profilePic: 'https://avatar.iran.liara.run/public/6',
  },
  {
    id: '7',
    name: 'John Doe',
    profilePic: 'https://avatar.iran.liara.run/public/7',
  },
  {
    id: '8',
    name: 'Jane Smith',
    profilePic: 'https://avatar.iran.liara.run/public/8',
  },
  {
    id: '9',
    name: 'Alice Johnson',
    profilePic: 'https://avatar.iran.liara.run/public/9',
  },
  {
    id: '10',
    name: 'Bob Brown',
    profilePic: 'https://avatar.iran.liara.run/public/10',
  },
  {
    id: '11',
    name: 'Charlie Davis',
    profilePic: 'https://avatar.iran.liara.run/public/11',
  },
  {
    id: '12',
    name: 'Diana Evans',
    profilePic: 'https://avatar.iran.liara.run/public/12',
  },
];

const renderStudentCard = ({item}) => (
  <TouchableOpacity style={styles.listCard}>
    <Image source={{uri: item.profilePic}} style={styles.profilePic} />
    <Text style={styles.studentName}>{item.name}</Text>
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

const HomeScreen = () => {
  return (
    <View style={styles.homeScreen}>
      <View style={styles.appBar}>
        <View>
          <Image
            style={styles.avatarImg}
            source={{
              uri: 'https://sm.ign.com/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.jpg',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(0,0,0)',
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
    // padding: 12,
    shadowColor: 'rgb(0,0,0)',
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
    backgroundColor: 'rgb(76,175,80)',
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
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
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
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
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
    paddingTop: 5,
    transform: [{rotate: '-45deg'}],
  },
});
