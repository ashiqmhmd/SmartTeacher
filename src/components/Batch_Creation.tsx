

// import React, { useRef, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

// const AnimatedInput = ({ label, icon, ...props }) => {
//     const [isFocused, setIsFocused] = useState(false);
//     const labelAnim = useRef(new Animated.Value(props.value ? 1 : 0)).current;
  
//     const animateLabel = (toValue) => {
//       Animated.timing(labelAnim, {
//         toValue,
//         duration: 200,
//         useNativeDriver: false,
//       }).start();
//     };
  
//     const handleFocus = () => {
//       setIsFocused(true);
//       animateLabel(1);
//     };
  
//     const handleBlur = () => {
//       if (!props.value) {
//         setIsFocused(false);
//         animateLabel(0);
//       }
//     };
  

//     const labelStyle = {
//         position: 'absolute',
//         left: icon ? 45 : 15,
//         backgroundColor: 'white',
//         paddingHorizontal: 4,
//         top: labelAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [12, -10],
//         }),
//         fontSize: labelAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [16, 12],
//         }),
//         color: isFocused ? '#4158D0' : '#666',
//         zIndex: 1,
//       };

//   return (
    
//     <View style={styles.inputContainer}>
//       <Animated.Text style={labelStyle}>{label}</Animated.Text>
//       {icon && <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />}
//       <TextInput
//         {...props}
//         style={[styles.input, icon && styles.inputWithIcon]}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         placeholder=""
//       />
//     </View>
//   );
// };

// const Batch_creation = () => {
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

//   const [activeStep, setActiveStep] = useState(0);

//   const steps = [
//     { title: 'Basic Info', icon: 'person' },
//     { title: 'Contact', icon: 'call' },
//     { title: 'Account', icon: 'lock-closed' }
//   ];

//   return (
//     <LinearGradient colors={['#4158D0', '#FFF']} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Student Profile</Text>
//           <Text style={styles.headerSubtitle}>Create your academic journey</Text>
//         </View>

//         <View style={styles.stepsContainer}>
//           {steps.map((step, index) => (
//             <View key={index} style={styles.stepWrapper}>
//               <TouchableOpacity
//                 style={[
//                   styles.stepButton,
//                   activeStep === index && styles.activeStep
//                 ]}
//                 onPress={() => setActiveStep(index)}
//               >
//                 <Ionicons 
//                   name={step.icon} 
//                   size={24} 
//                   color={activeStep === index ? '#fff' : '#666'} 
//                 />
//               </TouchableOpacity>
//               <Text style={styles.stepText}>{step.title}</Text>
//             </View>
//           ))}
//         </View>

//         <View style={styles.card}>
//           {activeStep === 0 && (
//             <>
//               <View style={styles.profileSection}>
//                 <TouchableOpacity style={styles.avatarContainer}>
//                   <LinearGradient
//                     colors={['#4158D0', '#C850C0']}
//                     style={styles.avatar}
//                   >
//                     <Ionicons name="camera" size={30} color="white" />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.row}>
//                 <View style={styles.halfWidth}>
//                   <AnimatedInput
//                     label="First Name"
//                     value={formData.firstName}
//                     onChangeText={(text) => setFormData({...formData, firstName: text})}
//                   />
//                 </View>
//                 <View style={styles.halfWidth}>
//                   <AnimatedInput
//                     label="Last Name"
//                     value={formData.lastName}
//                     onChangeText={(text) => setFormData({...formData, lastName: text})}
//                   />
//                 </View>
//               </View>

//               <View style={styles.genderContainer}>
//                 {['Male', 'Female', 'Other'].map((gender) => (
//                   <TouchableOpacity
//                     key={gender}
//                     style={[
//                       styles.genderButton,
//                       formData.gender === gender && styles.activeGender
//                     ]}
//                     onPress={() => setFormData({...formData, gender})}
//                   >
//                     <Text style={[
//                       styles.genderText,
//                       formData.gender === gender && styles.activeGenderText
//                     ]}>
//                       {gender}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </>
//           )}

//           {activeStep === 1 && (
//             <>
//               <AnimatedInput
                
//                 label="Contact Number"
//                 icon="call"
//                 keyboardType="phone-pad"
//                 value={formData.contactNumber}
//                 onChangeText={(text) => setFormData({...formData, contactNumber: text})}
//               />
//               <AnimatedInput
//                 label="Alternate Number"
//                 icon="phone-portrait"
//                 keyboardType="phone-pad"
//                 value={formData.alternateNumber}
//                 onChangeText={(text) => setFormData({...formData, alternateNumber: text})}
//               />
//               <AnimatedInput
//                 label="Email ID"
//                 icon="mail"
//                 keyboardType="email-address"
//                 value={formData.emailId}
//                 onChangeText={(text) => setFormData({...formData, emailId: text})}
//               />
//               <AnimatedInput
//                 label="Alternate Email"
//                 icon="mail-open"
//                 keyboardType="email-address"
//                 value={formData.alternateEmailId}
//                 onChangeText={(text) => setFormData({...formData, alternateEmailId: text})}
//               />
//             </>
//           )}

//           {activeStep === 2 && (
//             <>
//               <AnimatedInput
//                 label="Username"
//                 icon="person"
//                 value={formData.userName}
//                 onChangeText={(text) => setFormData({...formData, userName: text})}
//               />
//               <AnimatedInput
//                 label="Password"
//                 icon="lock-closed"
//                 secureTextEntry
//                 value={formData.password}
//                 onChangeText={(text) => setFormData({...formData, password: text})}
//               />
//               <AnimatedInput
//                 label="Parent Name"
//                 icon="people"
//                 value={formData.parentName}
//                 onChangeText={(text) => setFormData({...formData, parentName: text})}
//               />
//             </>
//           )}

//           <View style={styles.buttonContainer}>
//             {activeStep > 0 && (
//               <TouchableOpacity 
//                 style={styles.secondaryButton}
//                 onPress={() => setActiveStep(current => current - 1)}
//               >
//                 <Text style={styles.secondaryButtonText}>Previous</Text>
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity 
//               style={styles.primaryButton}
//               onPress={() => {
//                 if (activeStep < 2) {
//                   setActiveStep(current => current + 1);
//                 } else {
//                   console.log('Submit form:', formData);
//                 }
//               }}
//             >
//               <Text style={styles.primaryButtonText}>
//                 {activeStep === 2 ? 'Create Profile' : 'Next'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 5,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   stepWrapper: {
//     alignItems: 'center',
//   },
//   stepButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   activeStep: {
//     backgroundColor: '#4158D0',
//   },
//   stepText: {
//     color: 'white',
//     fontSize: 12,
//   },
//   card: {
//     backgroundColor: '#fffafa',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 20,
//     elevation: 5,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     overflow: 'hidden',
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   halfWidth: {
//     width: '48%',
//   },
//   inputContainer: {
//     marginBottom: 20,
//     position: 'relative',
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   inputWithIcon: {
//     paddingLeft: 40,
//   },
//   inputIcon: {
//     position: 'absolute',
//     left: 10,
//     top: 15,
//     zIndex: 1,
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   genderButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//   },
//   activeGender: {
//     backgroundColor: '#4158D0',
//     borderColor: '#4158D0',
//   },
//   genderText: {
//     color: '#666',
//   },
//   activeGenderText: {
//     color: 'white',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   primaryButton: {
//     flex: 1,
//     backgroundColor: '#4158D0',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   primaryButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   secondaryButton: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   secondaryButtonText: {
//     color: '#666',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default Batch_creation;


import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const BatchCreationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    subject: '',
    description: '',
    feeAmount: '',
    freequency: 'Monthly',
    paymentDate: ''
  });

  const scrollViewRef = useRef();
  const [activeSection, setActiveSection] = useState('basic');
  const [date,setDate] = useState("")


  useEffect(() =>{
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    setDate(
      date + '/' + month + '/' + year 
    );
  },[1])



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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['rgba(65, 88, 208, 0.8)', 'rgba(65, 88, 208, 0.4)']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create New Batch</Text>
          <View style={styles.statsContainer}>
             <View style={styles.profileSection}>
                            <TouchableOpacity style={styles.avatarContainer}>
                              
                                <Image style={{width:100,height:100}} resizeMode='cover' source={require("../resources/batch.png")}/>
                             
                            </TouchableOpacity>
                          </View>
            {/* <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Active Batches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View> */}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContent}>
          <View style={styles.sectionTabs}>
            <TouchableOpacity 
              style={[styles.sectionTab, activeSection === 'basic' && styles.activeTab]}
              onPress={() => setActiveSection('basic')}
            >
              <Ionicons name="document-text" size={20} color={activeSection === 'basic' ? '#4158D0' : '#666'} />
              <Text style={[styles.tabText, activeSection === 'basic' && styles.activeTabText]}>Basic Info</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sectionTab, activeSection === 'payment' && styles.activeTab]}
              onPress={() => setActiveSection('payment')}
            >
              <Ionicons name="card" size={20} color={activeSection === 'payment' ? '#4158D0' : '#666'} />
              <Text style={[styles.tabText, activeSection === 'payment' && styles.activeTabText]}>Payment</Text>
            </TouchableOpacity>
          </View>

          {activeSection === 'basic' ? (
            <>
              <AnimatedInput
                label="Batch Name"
                icon="bookmark"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
              <AnimatedInput
                label="Course"
                icon="school"
                value={formData.course}
                onChangeText={(text) => setFormData({...formData, course: text})}
              />
              <AnimatedInput
                label="Subject"
                icon="book"
                value={formData.subject}
                onChangeText={(text) => setFormData({...formData, subject: text})}
              />
               <AnimatedInput
                icon="calendar-number-outline"
                value={date}
                editable = {false}
                onChangeText={(text) => setFormData({...formData, subject: text})}
              />
              <AnimatedInput
                label="Description"
                icon="information-circle"
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </>
          ) : (
            <>
              <AnimatedInput
                label="Fee Amount"
                icon="cash"
                value={formData.feeAmount}
                onChangeText={(text) => setFormData({...formData, feeAmount: text})}
                keyboardType="numeric"
              />
              
              <View style={styles.freequencyWrapper}>
                <Text style={styles.freequencyTitle}>Payment Frequency</Text>
                <View style={styles.freequencyOptions}>
                  {['Monthly', 'Ontime'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.freequencyOption,
                        formData.freequency === option && styles.activeFrequency
                      ]}
                      onPress={() => setFormData({...formData, freequency: option})}
                    >
                      <View style={styles.radioOuter}>
                        <View style={[
                          styles.radioInner,
                          formData.freequency === option && styles.activeRadioInner
                        ]} />
                      </View>
                      <Text style={[
                        styles.freequencyText,
                        formData.freequency === option && styles.activeFrequencyText
                      ]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <AnimatedInput
                label="Payment Date"
                icon="calendar"
                value={formData.paymentDate}
                onChangeText={(text) => setFormData({...formData, paymentDate: text})}
              />
            </>
          )}

          <TouchableOpacity style={styles.submitButton}>
            <LinearGradient
              colors={['#4158D0', '#3B4FBC']}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>Create Batch</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  headerContainer: {
    height: 200,
  },
  headerGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerContent: {
    // marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  statsContainer: {
    // flexDirection: 'row',
    justifyContent:"center",
    // gap: 20,
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 12,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
  },
  formContent: {
    padding: 20,
  },
  sectionTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F9FE',
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#EEF0FF',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4158D0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  freequencyWrapper: {
    marginVertical: 20,
  },
  freequencyTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  freequencyOptions: {
    flexDirection: 'row',
    gap: 20,
  },
  freequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FE',
  },
  activeFrequency: {
    backgroundColor: '#EEF0FF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4158D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 0,
    height: 0,
    borderRadius: 6,
    backgroundColor: '#4158D0',
  },
  activeRadioInner: {
    width: 12,
    height: 12,
  },
  freequencyText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFrequencyText: {
    color: '#4158D0',
  },
  submitButton: {
    marginTop: 30,
    overflow: 'hidden',
    borderRadius: 12,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
      profileSection: {
        alignItems: 'center',
        marginBottom: 20,
      },
      avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor:"white"
      },
      avatar: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default BatchCreationForm;