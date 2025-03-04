import React, { useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import { postApi } from '../utils/api';
import { getUserId } from '../utils/TokenDecoder';
import { useDispatch } from 'react-redux';
import { login } from '../utils/authslice';

const TrendySignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createId, setcreateId] = useState("");
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  });

  const dispatch = useDispatch();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      phone: ''
    };



    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.password = 'Passwords are do not matching';
      isValid = false;
    }
 
    // if(Phone){
    //   const num = Phone.replace(".", '');
    //   if(isNaN(num)){

    //   }
    // }


    setErrors(newErrors);
    return isValid;
  };


  const handle_navigation = (id: any,) => {
    navigation.navigate('Update_Profile', { userId: id })
  }

  const Teacher_signup = async () => {

    if (!validateForm()) {
      return;
    }

    setErrors({ ...errors });
    const url = 'signup/teachers'
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const body = {
      userName: username,
      password: password,
      phoneNumber: Phone
    };
    const onResponse = async (res: { id: React.SetStateAction<string>; }) => {
      console.log('created succesfully');
      const Teacherid = await getUserId(res.token)
      const userData = {
        token: `${res.token}`,
        Teacher_id: Teacherid
      };
      dispatch(login(userData));
      setcreateId(Teacherid)
      handle_navigation(Teacherid && Teacherid )
    }
  
  const onCatch = (res: any) => {
    console.log('Error');
    console.log(res);
  };

  postApi(url, headers, body, onResponse, onCatch);
  

};

const renderError = (error: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => {
  if (!error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
};

return (
  <LinearGradient
    colors={['#1D49A7', '#1D49A7', '#FFF']}
    style={styles.container}>
    <StatusBar backgroundColor="#1D49A7" barStyle="light-content" />
    <View style={styles.logoContainer}>
      <Image style={styles.logo} source={require('../resources/logo.png')} />
      <Text style={styles.logotitle}>Smart Teacher</Text>
    </View>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.glassContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Smart Teacher</Text>
{/* 
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#001d3d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View> */}

          <View style={styles.inputContainer}>
            <Feather
              name="phone"
              size={20}
              color="#001d3d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              value={Phone}
              onChangeText={setPhone}
              keyboardType="numeric"
            />
          </View>
          {/* {renderError(errors.email)} */}

          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={20}
              color="#001d3d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="User Name"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          {renderError(errors.username)}

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#001d3d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordIcon}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#001d3d"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#001d3d"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.showPasswordIcon}>
              <Feather
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#001d3d"
              />
            </TouchableOpacity>
          </View>
          {renderError(errors.password)}

          <TouchableOpacity
            onPress={() =>
              Teacher_signup()
            }
            style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </LinearGradient>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  logotitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffff',
    textAlign: 'center',
    paddingTop: 12,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },

  glassContainer: {
    backgroundColor: '#ffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#1D49A7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#001d3d',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#001d3d',
    textAlign: 'center',
    marginBottom: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  showPasswordIcon: {
    padding: 10,
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    color: '#001d3d',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    height: 50,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginHorizontal: 3,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#001d3d',
  },
  genderButtonText: {
    color: 'white',
  },
  signupButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#001d3d',
  },
  loginLinkText: {
    color: '#1D49A7',
    fontWeight: 'bold',
  },
});

export default TrendySignupScreen;
