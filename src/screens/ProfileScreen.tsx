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
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({navigation}) => {
  const [imageError, setImageError] = useState(false);

  const [teacher, setTeacher] = useState({
    phoneNumber: '1234567890',
    addressState: 'Anystate',
    lastName: 'S',
    userName: 'krithi',
    email: 'john.doe@example.com',
    addressCity: 'Anytown',
    accountNumber: '1234567890',
    gender: 'male',
    firstName: 'Kirthi2',
    ifscCode: 'IFSC0001234',
    upiId: 'john@upi',
    profilePicUrl: 'http://example.com/profile.jpg',
    pinCode: 123456,
    accountName: 'John Doe',
    addressLine1: '123 Main St',
    id: '02fa458b-7d45-4869-bd28-aa8de5fea95c',
    age: 30,
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          // Handle logout logic here
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
        style: 'destructive',
      },
    ]);
  };

  const InfoSection = ({icon, title, value}) => (
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

  const Section = ({title, children}) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="rgb(0,0,0)" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile', {teacher})}>
          <MaterialIcons name="edit" size={24} color="#0F1F4B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                imageError
                  ? require('../resources/logo.png')
                  : {uri: teacher.profilePicUrl}
              }
              style={styles.profileImage}
              onError={() => setImageError(true)}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {teacher.firstName} {teacher.lastName}
          </Text>
          <Text style={styles.profileUsername}>@{teacher.userName}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="message" size={24} color="#0F1F4B" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="analytics" size={24} color="#0F1F4B" />
            <Text style={styles.actionText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="payments" size={24} color="#0F1F4B" />
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <Section title="Personal Information">
          <InfoSection icon="phone" title="Phone" value={teacher.phoneNumber} />
          <InfoSection icon="email" title="Email" value={teacher.email} />
          <InfoSection icon="person" title="Gender" value={teacher.gender} />
          <InfoSection icon="cake" title="Age" value={teacher.age.toString()} />
        </Section>

        {/* Address */}
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

        {/* Bank Details */}
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0F1F4B',
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
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
