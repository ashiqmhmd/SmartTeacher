import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logout } from '../utils/authslice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getapi, deleteapi } from '../utils/api';
import { getUserId } from '../utils/TokenDecoder';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ navigation, item }) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const defaultTeacher = {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    age: 0,
    addressLine1: '',
    addressCity: '',
    addressState: '',
    pinCode: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    profilePicUrl: 'https://via.placeholder.com/150',
  };

  const [teacher, setTeacher] = useState(defaultTeacher);

  const dispatch = useDispatch();

  const TeacherDetails = async () => {
    try {
      setLoading(true);

      const Token = await AsyncStorage.getItem('Token');
      if (!Token) {
        throw new Error('No token found, authentication required');
      }

      const Teacherid = await getUserId(Token);
      if (!Teacherid) {
        throw new Error('Failed to fetch Teacher ID');
      }

      const url = `teachers/${Teacherid}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      const onResponse = res => {
        if (res) {
          setTeacher(prevTeacher => ({
            ...prevTeacher,
            ...res,
          }));
        }
        setLoading(false);
      };

      const onCatch = error => {
        console.error('API Error:', error);
        setLoading(false);
      };

      getapi(url, headers, onResponse, onCatch);

      // Fetch batches for the teacher
      const batchesUrl = `batches/teacher/${Teacherid}`;
      const batchesHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token}`,
      };

      console.log("Batches fetching apiii")

      const onBatchesResponse = res => {
        if (res) {
          setBatches(res);
        }
      };

      const onBatchesCatch = error => {
        console.error('Batches API Error:', error);
      };

      getapi(batchesUrl, batchesHeaders, onBatchesResponse, onBatchesCatch);
    } catch (error) {
      console.error('TeacherDetails Error:', error.message);
      setLoading(false);
    }
  };

  const handleDeleteBatch = batchId => {
    Alert.alert('Delete Batch', 'Are you sure you want to delete this batch?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const Token = await AsyncStorage.getItem('Token');
            const url = `batches/${batchId}`;
            const headers = {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Token}`,
            };
            const onResponse = async (res) => {
              setBatches(prevBatches =>
                prevBatches.filter(batch => batch.id !== batchId),
              );
              console.log("Batch deleted successfully")
              Alert.alert('Success', 'Batch deleted successfully');
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
              setLoading(false);
            }



            const onCatch = res => {
              console.error('Delete Batch Error:', res);
              Alert.alert('Error', 'Failed to delete batch');
            };

            deleteapi(url, headers, onResponse, onCatch);
          } catch (error) {
            console.error('Delete Batch Error:', error);
            Alert.alert('Error', 'Failed to delete batch');
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          logoutbutton_press();
        },
        style: 'destructive',
      },
    ]);
  };

  const logoutbutton_press = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    dispatch(logout());
    await AsyncStorage.removeItem('Token');
  };

  useEffect(() => {
    TeacherDetails();
  }, []);

  const InfoSection = ({ icon, title, value }) => (
    <View style={styles.infoSection}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={20} color="#0F1F4B" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="rgb(0,0,0)" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Update_Profile', { teacher, update: true })
          }>
          <MaterialIcons name="edit" size={24} color="#0F1F4B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                !teacher.profilePicUrl
                  ? require('../resources/logo.png')
                  : { uri: teacher.profilePicUrl }
              }
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>
            {teacher.firstName} {teacher.lastName}
          </Text>
          <Text style={styles.profileUsername}>@{teacher.userName}</Text>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#E5E7EB',
            marginBottom: 20,
          }}></View>

        <Section title="Personal Information">
          <InfoSection icon="phone" title="Phone" value={teacher.phoneNumber} />
          <InfoSection icon="email" title="Email" value={teacher.email} />
          <InfoSection icon="person" title="Gender" value={teacher.gender} />
          <InfoSection icon="cake" title="Age" value={teacher.age.toString()} />
        </Section>

        <Section title="Address">
          <InfoSection
            icon="home"
            title="Street"
            value={teacher.addressLine1}
          />
          <InfoSection
            icon="location-city"
            title="City"
            value={teacher.addressCity}
          />
          <InfoSection icon="map" title="State" value={teacher.addressState} />
          <InfoSection
            icon="pin-drop"
            title="Pin Code"
            value={teacher.pinCode.toString()}
          />
        </Section>

        <Section title="Payment Information">
          <InfoSection
            icon="account-balance"
            title="Account Name"
            value={teacher.accountName}
          />
          <InfoSection
            icon="credit-card"
            title="Account Number"
            value={`XXXX XXXX ${teacher.accountNumber.slice(-4)}`}
          />
          <InfoSection
            icon="receipt"
            title="IFSC Code"
            value={teacher.ifscCode}
          />
          <InfoSection icon="payment" title="UPI ID" value={teacher.upiId} />
        </Section>

        <View style={styles.section}>
          <View style={styles.batchHeader}>
            <Text style={styles.sectionTitle}>My Batches</Text>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Create_Batch')}
              style={styles.addBatchButton}>
              <MaterialIcons name="add" size={24} color="#0F1F4B" />
            </TouchableOpacity> */}
          </View>
          <View style={styles.batchList}>
            {batches.map((batch, index) => (
              <View key={index} style={styles.batchCard}>
                <LinearGradient
                  colors={['#f8f9ff', '#ffffff']}
                  style={styles.batchContent}>
                  <View style={styles.batchInfo}>
                    <Text style={styles.batchName}>{batch.name}</Text>
                    <Text style={styles.batchId}>{batch.subject}</Text>
                  </View>
                  <View style={styles.batchActions}>
                    <TouchableOpacity
                      style={styles.editBatchButton}
                      onPress={() =>
                        navigation.navigate('Batch_Create', { batch,update:true })
                      }>
                      <MaterialIcons name="edit" size={24} color="#0F1F4B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBatchButton}
                      onPress={() => handleDeleteBatch(batch.id)}>
                      <MaterialIcons name="delete" size={24} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: 'rgb(15, 31, 75)',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0F1F4B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F1F4B',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F1F4B',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: 'rgb(105, 144, 252)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  // infoSection: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 8,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E5E7EB',
  // },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#0F1F4B',
    fontWeight: '500',
  },
  batchList: {
    gap: 12,
  },
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 15,
    overflow: 'hidden',
    shadowColor: '#0F1F4B',
  },
  batchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  batchId: {
    fontSize: 12,
    color: '#666',
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBatchButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  batchActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBatchButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 12,
  },
  deleteBatchButton: {
    padding: 8,
    borderRadius: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
