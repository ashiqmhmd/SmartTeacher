import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

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
];

const renderStudentCard = ({item}) => (
  <TouchableOpacity style={styles.listCard}>
    <Image source={{uri: item.profilePic}} style={styles.profilePic} />
    <Text style={styles.studentName}>{item.name}</Text>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="message" size={20} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="visibility" size={20} color="#2196F3" />
      </TouchableOpacity>
    </View>
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
        <Icon
          style={styles.notificationIcon}
          name="rocket"
          size={30}
          color="#900"
        />
      </View>
      <View style={styles.container}>
        <View style={styles.batchCard}></View>
        <Text style={styles.listTitle}>Students In Batch</Text>
        {/* Student List */}
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
    backgroundColor: '#ffff',
  },
  appBar: {
    // elevation: 1,
    // backgroundColor: 'green',
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
    color: '#000',
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
  },
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'green',
    flex: 1,
    paddingHorizontal: 20,
  },
  batchCard: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    padding: 3,
    // width: '100%',
  },
  listCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
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
});
