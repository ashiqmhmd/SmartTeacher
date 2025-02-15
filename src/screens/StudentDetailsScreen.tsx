// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import LinearGradient from 'react-native-linear-gradient';

// const StudentDetailsScreen = ({route, navigation}) => {
//   const student = route.params.student;

//   const renderContactSection = (title, items) => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <View style={styles.sectionContent}>
//         {items.map((item, index) => (
//           <View key={index} style={styles.contactItem}>
//             <MaterialIcons name={item.icon} size={20} color="#666" />
//             <Text style={styles.contactText}>{item.value}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.screen}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       <View style={styles.appBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#001d3d" />
//         </TouchableOpacity>
//         <Text style={styles.appBarTitle}>Student Details</Text>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('EditStudent', {student})}>
//           <MaterialIcons name="edit" size={24} color="#001d3d" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.container}>
//         {/* Profile Section */}
//         <LinearGradient
//           colors={['rgb(255,255,255)', 'rgb(229,235,252)']}
//           style={styles.profileCard}>
//           <Image
//             source={{uri: student.profilePicUrl}}
//             style={styles.profileImage}
//           />
//           <Text style={styles.studentName}>
//             {student.firstName} {student.lastName}
//           </Text>
//           <View style={styles.basicInfo}>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Age</Text>
//               <Text style={styles.infoValue}>{student.age}</Text>
//             </View>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Gender</Text>
//               <Text style={styles.infoValue}>{student.gender}</Text>
//             </View>
//             <View style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Batches</Text>
//               <Text style={styles.infoValue}>{student.batches.length}</Text>
//             </View>
//           </View>
//         </LinearGradient>

//         {renderContactSection('Parent 1 Contact', [
//           {icon: 'person', value: student.parent1Name},
//           {icon: 'phone', value: student.parent1Phone},
//           {icon: 'email', value: student.parent1Email},
//         ])}

//         {renderContactSection('Parent 2 Contact', [
//           {icon: 'person', value: student.parent2Name},
//           {icon: 'phone', value: student.parent2Phone},
//           {icon: 'email', value: student.parent2Email},
//         ])}

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Address</Text>
//           <View style={styles.sectionContent}>
//             <Text style={styles.addressText}>{student.addressLine1}</Text>
//             <Text style={styles.addressText}>
//               {student.addressCity}, {student.addressState}
//             </Text>
//             <Text style={styles.addressText}>PIN: {student.pinCode}</Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Enrolled Batches</Text>
//           <View style={styles.batchList}>
//             {student.batches.map((batchId, index) => (
//               <View key={index} style={styles.batchItem}>
//                 <Text style={styles.batchText}>Batch {index + 1}</Text>
//                 <MaterialIcons name="chevron-right" size={24} color="#666" />
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: 'rgb(255,255,255)',
//   },
//   appBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 10,
//     backgroundColor: '#fff',
//     elevation: 2,
//   },
//   appBarTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#001d3d',
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   profileCard: {
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 20,
//     elevation: 4,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 12,
//   },
//   studentName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#001d3d',
//     marginBottom: 12,
//   },
//   basicInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 10,
//   },
//   infoItem: {
//     alignItems: 'center',
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#001d3d',
//   },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#001d3d',
//     marginBottom: 12,
//   },
//   sectionContent: {
//     gap: 8,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   contactText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   addressText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 4,
//   },
//   batchList: {
//     gap: 8,
//   },
//   batchItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 12,
//     borderRadius: 8,
//   },
//   batchText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default StudentDetailsScreen;

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const StudentDetailsScreen = ({route, navigation}) => {
  const student = route.params.student;

  const renderContactSection = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <LinearGradient
        colors={['#ffffff', '#f8f9ff']}
        style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.icon} size={20} color="#001d3d" />
            </View>
            <View>
              <Text style={styles.contactLabel}>{item.label}</Text>
              <Text style={styles.contactValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#001d3d" barStyle="light-content" />

      <LinearGradient colors={['#001d3d', '#002855']} style={styles.header}>
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditStudent', {student})}
            style={styles.editButton}>
            <MaterialIcons name="edit" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{uri: student.profilePicUrl}}
            style={styles.profileImage}
          />
          <Text style={styles.studentName}>
            {student.firstName} {student.lastName}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ID: {student.id.slice(0, 8)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{student.age}</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{student.gender}</Text>
            <Text style={styles.statLabel}>Gender</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{student.batches.length}</Text>
            <Text style={styles.statLabel}>Batches</Text>
          </View>
        </View>

        {renderContactSection('Primary Guardian', [
          {icon: 'person', label: 'Name', value: student.parent1Name},
          {icon: 'phone', label: 'Phone', value: student.parent1Phone},
          {icon: 'email', label: 'Email', value: student.parent1Email},
        ])}

        {renderContactSection('Secondary Guardian', [
          {icon: 'person', label: 'Name', value: student.parent2Name},
          {icon: 'phone', label: 'Phone', value: student.parent2Phone},
          {icon: 'email', label: 'Email', value: student.parent2Email},
        ])}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <LinearGradient
            colors={['#ffffff', '#f8f9ff']}
            style={styles.addressCard}>
            <MaterialIcons
              name="location-on"
              size={24}
              color="#001d3d"
              style={styles.addressIcon}
            />
            <View style={styles.addressContent}>
              <Text style={styles.addressLine}>{student.addressLine1}</Text>
              <Text style={styles.addressLine}>
                {student.addressCity}, {student.addressState}
              </Text>
              <Text style={styles.pinCode}>PIN: {student.pinCode}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enrolled Batches</Text>
          <View style={styles.batchList}>
            {student.batches.map((batchId, index) => (
              <TouchableOpacity key={index} style={styles.batchCard}>
                <LinearGradient
                  colors={['#f8f9ff', '#ffffff']}
                  style={styles.batchContent}>
                  <View style={styles.batchInfo}>
                    <Text style={styles.batchName}>Batch {index + 1}</Text>
                    <Text style={styles.batchId}>{batchId.slice(0, 8)}</Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#001d3d"
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width * 0.28,
    elevation: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001d3d',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001d3d',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  iconContainer: {
    backgroundColor: '#f0f3ff',
    padding: 10,
    borderRadius: 12,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#001d3d',
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    flexDirection: 'row',
  },
  addressIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  addressContent: {
    flex: 1,
  },
  addressLine: {
    fontSize: 16,
    color: '#001d3d',
    marginBottom: 4,
  },
  pinCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  batchList: {
    gap: 12,
  },
  batchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
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
    color: '#001d3d',
    marginBottom: 4,
  },
  batchId: {
    fontSize: 12,
    color: '#666',
  },
});

export default StudentDetailsScreen;
