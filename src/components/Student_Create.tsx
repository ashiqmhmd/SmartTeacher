// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ScrollView,
//   Image
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

// const ModernStudentRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     userName: '',
//     password: '',
//     parentName: '',
//     contactNumber: '',
//     alternateNumber: '',
//     emailId: '',
//     alternateEmailId: ''
//   });

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({...prev, [field]: value}));
//   };

//   const handleCreate = () => {
//     console.log('Form Data:', formData);
//   };

//   return (
//     <LinearGradient 
//       colors={['#6a11cb', '#2575fc']} 
//       style={styles.container}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.headerContainer}>
//           <Text style={styles.title}>Create Student Profile</Text>
//           <TouchableOpacity style={styles.profileImageContainer}>
//             <Image 
//               source={require("../resources/placeholder-avatar.jpg")} 
//               style={styles.profileImage}
//             />
//             <View style={styles.cameraIconContainer}>
//               <Ionicons name="camera" size={16} color="white" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.formContainer}>
//           <View style={styles.inputRow}>
//             <TextInput
//               style={[styles.input, styles.halfWidth]}
//               placeholder="First Name"
//               placeholderTextColor="#aaa"
//               value={formData.firstName}
//               onChangeText={(text) => handleInputChange('firstName', text)}
//             />
//             <TextInput
//               style={[styles.input, styles.halfWidth]}
//               placeholder="Last Name"
//               placeholderTextColor="#aaa"
//               value={formData.lastName}
//               onChangeText={(text) => handleInputChange('lastName', text)}
//             />
//           </View>

//           <View style={styles.genderContainer}>
//             {['Male', 'Female', 'Other'].map((gender) => (
//               <TouchableOpacity
//                 key={gender}
//                 style={[
//                   styles.genderButton, 
//                   formData.gender === gender && styles.selectedGender
//                 ]}
//                 onPress={() => handleInputChange('gender', gender)}
//               >
//                 <Text style={styles.genderButtonText}>{gender}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {[
//             { name: 'userName', icon: 'person', placeholder: 'Username' },
//             { name: 'password', icon: 'lock-closed', placeholder: 'Password', secure: true },
//             { name: 'parentName', icon: 'people', placeholder: 'Parent Name' },
//             { name: 'contactNumber', icon: 'call', placeholder: 'Contact Number', keyboard: 'phone-pad' },
//             { name: 'alternateNumber', icon: 'phone-portrait', placeholder: 'Alternate Number', keyboard: 'phone-pad' },
//             { name: 'emailId', icon: 'mail', placeholder: 'Email ID', keyboard: 'email-address' },
//             { name: 'alternateEmailId', icon: 'mail-open', placeholder: 'Alternate Email', keyboard: 'email-address' }
//           ].map((field) => (
//             <View key={field.name} style={styles.inputWithIcon}>
//               <Ionicons 
//                 name={field.icon} 
//                 size={20} 
//                 color="#6a11cb" 
//                 style={styles.inputIcon} 
//               />
//               <TextInput
//                 style={styles.iconInput}
//                 placeholder={field.placeholder}
//                 placeholderTextColor="#aaa"
//                 secureTextEntry={field.secure}
//                 keyboardType={field.keyboard}
//                 value={formData[field.name]}
//                 onChangeText={(text) => handleInputChange(field.name, text)}
//               />
//             </View>
//           ))}

//           <TouchableOpacity 
//             style={styles.createButton} 
//             onPress={handleCreate}
//           >
//             <Text style={styles.createButtonText}>Create Profile</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingVertical: 40
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 30
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20
//   },
//   profileImageContainer: {
//     position: 'relative'
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: 'white'
//   },
//   cameraIconContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#6a11cb',
//     borderRadius: 20,
//     padding: 5
//   },
//   formContainer: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5
//   },
//   inputRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15
//   },
//   input: {
//     height: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingHorizontal: 10
//   },
//   halfWidth: {
//     width: '48%'
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15
//   },
//   genderButton: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8
//   },
//   selectedGender: {
//     backgroundColor: '#6a11cb',
//     borderColor: '#6a11cb'
//   },
//   genderButtonText: {
//     textAlign: 'center',
//     color: 'black'
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     marginBottom: 15
//   },
//   inputIcon: {
//     marginRight: 10
//   },
//   iconInput: {
//     flex: 1,
//     height: 50
//   },
//   createButton: {
//     backgroundColor: '#6a11cb',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 10
//   },
//   createButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: 'bold'
//   }
// });

// export default ModernStudentRegistrationForm;



import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedInput = ({ label, icon, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelAnim = useRef(new Animated.Value(props.value ? 1 : 0)).current;
  
    const animateLabel = (toValue) => {
      Animated.timing(labelAnim, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };
  
    const handleFocus = () => {
      setIsFocused(true);
      animateLabel(1);
    };
  
    const handleBlur = () => {
      if (!props.value) {
        setIsFocused(false);
        animateLabel(0);
      }
    };
  

    const labelStyle = {
        position: 'absolute',
        left: icon ? 45 : 15,
        backgroundColor: 'white',
        paddingHorizontal: 4,
        top: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, -10],
        }),
        fontSize: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 12],
        }),
        color: isFocused ? '#4158D0' : '#666',
        zIndex: 1,
      };

  return (
    
    <View style={styles.inputContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      {icon && <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />}
      <TextInput
        {...props}
        style={[styles.input, icon && styles.inputWithIcon]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=""
      />
    </View>
  );
};

const PremiumStudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    userName: '',
    password: '',
    parentName: '',
    contactNumber: '',
    alternateNumber: '',
    emailId: '',
    alternateEmailId: ''
  });

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Basic Info', icon: 'person' },
    { title: 'Contact', icon: 'call' },
    { title: 'Account', icon: 'lock-closed' }
  ];

  return (
    <LinearGradient colors={['#4158D0', '#FFF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <Text style={styles.headerSubtitle}>Create your academic journey</Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepWrapper}>
              <TouchableOpacity
                style={[
                  styles.stepButton,
                  activeStep === index && styles.activeStep
                ]}
                onPress={() => setActiveStep(index)}
              >
                <Ionicons 
                  name={step.icon} 
                  size={24} 
                  color={activeStep === index ? '#fff' : '#666'} 
                />
              </TouchableOpacity>
              <Text style={styles.stepText}>{step.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          {activeStep === 0 && (
            <>
              <View style={styles.profileSection}>
                <TouchableOpacity style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#4158D0', '#C850C0']}
                    style={styles.avatar}
                  >
                    <Ionicons name="camera" size={30} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <AnimatedInput
                    label="First Name"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({...formData, firstName: text})}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <AnimatedInput
                    label="Last Name"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({...formData, lastName: text})}
                  />
                </View>
              </View>

              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.gender === gender && styles.activeGender
                    ]}
                    onPress={() => setFormData({...formData, gender})}
                  >
                    <Text style={[
                      styles.genderText,
                      formData.gender === gender && styles.activeGenderText
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {activeStep === 1 && (
            <>
              <AnimatedInput
                
                label="Contact Number"
                icon="call"
                keyboardType="phone-pad"
                value={formData.contactNumber}
                onChangeText={(text) => setFormData({...formData, contactNumber: text})}
              />
              <AnimatedInput
                label="Alternate Number"
                icon="phone-portrait"
                keyboardType="phone-pad"
                value={formData.alternateNumber}
                onChangeText={(text) => setFormData({...formData, alternateNumber: text})}
              />
              <AnimatedInput
                label="Email ID"
                icon="mail"
                keyboardType="email-address"
                value={formData.emailId}
                onChangeText={(text) => setFormData({...formData, emailId: text})}
              />
              <AnimatedInput
                label="Alternate Email"
                icon="mail-open"
                keyboardType="email-address"
                value={formData.alternateEmailId}
                onChangeText={(text) => setFormData({...formData, alternateEmailId: text})}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <AnimatedInput
                label="Username"
                icon="person"
                value={formData.userName}
                onChangeText={(text) => setFormData({...formData, userName: text})}
              />
              <AnimatedInput
                label="Password"
                icon="lock-closed"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
              />
              <AnimatedInput
                label="Parent Name"
                icon="people"
                value={formData.parentName}
                onChangeText={(text) => setFormData({...formData, parentName: text})}
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            {activeStep > 0 && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setActiveStep(current => current - 1)}
              >
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                if (activeStep < 2) {
                  setActiveStep(current => current + 1);
                } else {
                  console.log('Submit form:', formData);
                }
              }}
            >
              <Text style={styles.primaryButtonText}>
                {activeStep === 2 ? 'Create Profile' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stepWrapper: {
    alignItems: 'center',
  },
  stepButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: '#4158D0',
  },
  stepText: {
    color: 'white',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fffafa',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 15,
    zIndex: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeGender: {
    backgroundColor: '#4158D0',
    borderColor: '#4158D0',
  },
  genderText: {
    color: '#666',
  },
  activeGenderText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4158D0',
    paddingVertical: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PremiumStudentForm;