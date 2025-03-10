// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Image,
//   StatusBar,
// } from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { postApi, putapi } from '../utils/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { base_url } from '../utils/store';

// const UpdateProfileScreen = ({ navigation, route }) => {

//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     age: '',
//     gender: '',
//     addressLine1: '',
//     addressCity: '',
//     addressState: '',
//     pinCode: '',
//     profilePicUrl: '',
//     phoneNumber: '',
//     upiId: '',
//     accountNumber: '',
//     accountName: '',
//     ifscCode: '',
//   });

//   const [profileImage, setProfileImage] = useState();
//   const [uploadedprofileImage, setUploadedProfileImage] = useState('');

//   const [formdatas, setformdata] = useState()
//   const { userId } = route.params;
//   const handleInputChange = (field: any, value: string) => {
//     setProfileData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleImagePicker = async () => {
//     const result = await launchImageLibrary({
//       mediaType: 'photo',
//       quality: 1,
//     });

//     if (!result.didCancel && result.assets?.[0]?.uri) {


//       const profileImage = result?.assets?.length ? result.assets[0] : null;

//       if (!profileImage || !profileImage.uri) {
//         console.log("No valid image selected!");
//         return;
//       }

//       const fileData = {
//         uri: Platform.OS === 'android' ? profileImage.uri : profileImage.uri.replace('file://', ''),
//         type: profileImage.type || 'image/jpeg',
//         name: profileImage.fileName || 'file.jpg',
//       };

//       console.log("File Data Before Append:", fileData);

//       // Create FormData
//       const formData = new FormData();
//       formData.append('file', fileData);

//       console.log("FormData Object:", formData);

//       // Save Image & FormData
//       setProfileImage(fileData.uri);
//       setformdata(formData); // Store FormData directly, NOT as JSON!
//     }


//   };
  

//   useEffect(() => {
//     console.log(userId)
//   }, [1])


//   const profilephoto_upload = async () => {
//     try {
//       const Token = await AsyncStorage.getItem('Token');

//       if (!formdatas) {
//         console.log("No image selected for upload!");
//         return;
//       }

//       // Replace with the actual API base URL
//       const url = `${base_url}uploads`;

//       console.log("Uploading Image to:", url);
//       console.log("FormData Before Upload:", formdatas);

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${Token}`,
//           "Content-Type": "multipart/form-data", // Required for FormData uploads
//         },
//         body: formdatas, // Sending FormData directly
//       });

//       console.log("Status Code:", response.status);

//       const textResponse = await response.text(); // Read raw response first
//       console.log("Raw Response:", textResponse);

//       // Parse JSON only if response is valid
//       let responseData;
//       try {
//         responseData = JSON.parse(textResponse);
//       } catch (error) {
//         console.error("Error parsing JSON response:", error);
//         responseData = { message: "Invalid JSON response from server" };
//       }

//       console.log("Parsed Response:", responseData);

//       if (!response.ok) {
//         throw new Error(`Upload failed: ${responseData.message || "Unknown error"}`);
//       }


//       console.log("Upload Successful!", responseData.url);
//       setUploadedProfileImage(responseData.url)
//       submitButton(responseData.url)
//       return responseData.url;

//     } catch (error) {
//       console.error("Error updating profile:", error.message);
//     }
//   };



//   const handleSubmit = async () => {

//     profileImage ?
//       profilephoto_upload()

//       :
//       submitButton()

//   }


//   const submitButton = async (profilePicUrl: any) => {
//     const Token = await AsyncStorage.getItem('Token');
//     const url = `teachers/${userId}`;
//     const headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${Token}`,
//     };

//     const body = profileImage ? {
//       ...profileData,
//       profilePicUrl: profilePicUrl ? profilePicUrl : uploadedprofileImage,
//     }

//       :
//       {
//         ...profileData,
//       }
//       ;

//     const onResponse = (res: any) => {
//       console.log(res)
//       console.log('Profile updated successfully');
//       console.log(Token)
//       navigation.replace('Tabs');

//     };

//     const onCatch = (err: any) => {
//       console.log('Error updating profile:', err);
//     };

//     putapi(url, headers, body, onResponse, onCatch);
//   };



//   const renderInput = (icon: string, placeholder: string | undefined, field: string, keyboardType = 'default') => (
//     <View style={styles.inputContainer}>
//       <Feather name={icon} size={20} color="#001d3d" style={styles.inputIcon} />
//       <TextInput
//         style={styles.input}
//         placeholder={placeholder}
//         placeholderTextColor="#888"
//         value={profileData[field]}
//         onChangeText={value => handleInputChange(field, value)}
//         keyboardType={keyboardType}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#1D49A7" barStyle="light-content" />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardContainer}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled">
//           <Text style={styles.title}>Complete Your Profile</Text>

//           <TouchableOpacity
//             style={styles.imagePickerContainer}
//             onPress={handleImagePicker}>
//             {profileImage ? (
//               <Image source={{ uri: profileImage }} style={styles.profileImage} />
//             ) : (
//               <View style={styles.imagePlaceholder}>
//                 <Feather name="camera" size={40} color="#001d3d" />
//                 <Text style={styles.imagePlaceholderText}>
//                   Add Profile Photo
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Personal Information</Text>
//             {renderInput('user', 'First Name', 'firstName')}
//             {renderInput('user', 'Last Name', 'lastName')}
//             {renderInput('calendar', 'Age', 'age', 'numeric')}
//             {renderInput('users', 'Gender', 'gender')}
//             {renderInput('phone', 'Phone Number', 'phoneNumber', 'phone-pad')}
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Address Details</Text>
//             {renderInput('home', 'Address Line 1', 'addressLine1')}
//             {renderInput('map-pin', 'City', 'addressCity')}
//             {renderInput('map', 'State', 'addressState')}
//             {renderInput('hash', 'Pin Code', 'pinCode', 'numeric')}
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Banking Details</Text>
//             {renderInput('credit-card', 'Account Number', 'accountNumber')}
//             {renderInput('user', 'Account Holder Name', 'accountName')}
//             {renderInput('hash', 'IFSC Code', 'ifscCode')}
//             {renderInput('smartphone', 'UPI ID', 'upiId')}
//           </View>

//           <TouchableOpacity
//             onPress={() => handleSubmit}
//             // onPress={() => navigation.navigate('Tabs')}
//             style={styles.submitButton}>
//             <Text style={styles.submitButtonText}>Save Profile</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   keyboardContainer: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: '5%',
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#001d3d',
//     textAlign: 'center',
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#001d3d',
//     marginBottom: 15,
//   },
//   imagePickerContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   imagePlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   imagePlaceholderText: {
//     color: '#001d3d',
//     marginTop: 5,
//     fontSize: 12,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 10,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     color: '#333',
//   },
//   submitButton: {
//     backgroundColor: '#001d3d',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default UpdateProfileScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { postApi, putapi } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../utils/store';

const UpdateProfileScreen = ({ navigation, route }) => {

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    addressLine1: '',
    addressCity: '',
    addressState: '',
    pinCode: '',
    profilePicUrl: '',
    phoneNumber: '',
    upiId: '',
    accountNumber: '',
    accountName: '',
    ifscCode: '',
  });

  const [profileImage, setProfileImage] = useState();
  const [uploadedprofileImage, setUploadedProfileImage] = useState('');

  const [formdatas, setformdata] = useState()
  const { userId } = route.params;
  const handleInputChange = (field: any, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];

  // Handle gender selection
  const handleGenderSelect = (value) => {
    setProfileData(prev => ({
      ...prev,
      gender: value,
    }));
  };

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets?.[0]?.uri) {


      const profileImage = result?.assets?.length ? result.assets[0] : null;

      if (!profileImage || !profileImage.uri) {
        console.log("No valid image selected!");
        return;
      }

      const fileData = {
        uri: Platform.OS === 'android' ? profileImage.uri : profileImage.uri.replace('file://', ''),
        type: profileImage.type || 'image/jpeg',
        name: profileImage.fileName || 'file.jpg',
      };

      console.log("File Data Before Append:", fileData);

      // Create FormData
      const formData = new FormData();
      formData.append('file', fileData);

      console.log("FormData Object:", formData);

      // Save Image & FormData
      setProfileImage(fileData.uri);
      setformdata(formData); // Store FormData directly, NOT as JSON!
    }


  };
  

  useEffect(() => {
    console.log(userId)
  }, [1])


  const profilephoto_upload = async () => {
    try {
      const Token = await AsyncStorage.getItem('Token');

      if (!formdatas) {
        console.log("No image selected for upload!");
        return;
      }

      // Replace with the actual API base URL
      const url = `${base_url}uploads`;

      console.log("Uploading Image to:", url);
      console.log("FormData Before Upload:", formdatas);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "multipart/form-data", // Required for FormData uploads
        },
        body: formdatas, // Sending FormData directly
      });

      console.log("Status Code:", response.status);

      const textResponse = await response.text(); // Read raw response first
      console.log("Raw Response:", textResponse);

      // Parse JSON only if response is valid
      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        responseData = { message: "Invalid JSON response from server" };
      }

      console.log("Parsed Response:", responseData);

      if (!response.ok) {
        throw new Error(`Upload failed: ${responseData.message || "Unknown error"}`);
      }


      console.log("Upload Successful!", responseData.url);
      setUploadedProfileImage(responseData.url)
      submitButton(responseData.url)
      return responseData.url;

    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };



  const handleSubmit = async () => {

    profileImage ?
      profilephoto_upload()

      :
      submitButton()

  }


  const submitButton = async (profilePicUrl: any) => {
    const Token = await AsyncStorage.getItem('Token');
    const url = `teachers/${userId}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    const body = profileImage ? {
      ...profileData,
      profilePicUrl: profilePicUrl ? profilePicUrl : uploadedprofileImage,
    }

      :
      {
        ...profileData,
      }
      ;

    const onResponse = (res: any) => {
      console.log(res)
      console.log('Profile updated successfully');
      console.log(Token)
      navigation.replace('Tabs');

    };

    const onCatch = (err: any) => {
      console.log('Error updating profile:', err);
    };

    putapi(url, headers, body, onResponse, onCatch);
  };



  const renderInput = (icon: string, placeholder: string | undefined, field: string, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Feather name={icon} size={20} color="#001d3d" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={profileData[field]}
        onChangeText={value => handleInputChange(field, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  // Radio button component for gender selection
  const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
      <View style={styles.radioButton}>
        {selected && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  // Render gender selection component
  const renderGenderSelection = () => (
    <View style={styles.genderContainer}>
      <Feather name="users" size={20} color="#001d3d" style={styles.genderIcon} />
      <View style={styles.radioGroup}>
        {genderOptions.map(option => (
          <RadioButton
            key={option}
            label={option}
            selected={profileData.gender === option}
            onPress={() => handleGenderSelect(option)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1D49A7" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Complete Your Profile</Text>

          <TouchableOpacity
            style={styles.imagePickerContainer}
            onPress={handleImagePicker}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={40} color="#001d3d" />
                <Text style={styles.imagePlaceholderText}>
                  Add Profile Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderInput('user', 'First Name', 'firstName')}
            {renderInput('user', 'Last Name', 'lastName')}
            {renderInput('calendar', 'Age', 'age', 'numeric')}
            {renderGenderSelection()}
            {renderInput('phone', 'Phone Number', 'phoneNumber', 'phone-pad')}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            {renderInput('home', 'Address Line 1', 'addressLine1')}
            {renderInput('map-pin', 'City', 'addressCity')}
            {renderInput('map', 'State', 'addressState')}
            {renderInput('hash', 'Pin Code', 'pinCode', 'numeric')}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Banking Details</Text>
            {renderInput('credit-card', 'Account Number', 'accountNumber')}
            {renderInput('user', 'Account Holder Name', 'accountName')}
            {renderInput('hash', 'IFSC Code', 'ifscCode')}
            {renderInput('smartphone', 'UPI ID', 'upiId')}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001d3d',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001d3d',
    marginBottom: 15,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholderText: {
    color: '#001d3d',
    marginTop: 5,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Styles for gender radio button
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  genderIcon: {
    marginRight: 10,
  },
  radioGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#001d3d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#001d3d',
  },
  radioButtonLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default UpdateProfileScreen;