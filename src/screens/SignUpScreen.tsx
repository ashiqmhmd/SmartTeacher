import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {postApi} from '../utils/api';
import {getUserId, getUserName} from '../utils/TokenDecoder';
import {useDispatch} from 'react-redux';
import {login} from '../utils/authslice';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createId, setCreateId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
  });

  const dispatch = useDispatch();

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = phone => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      phone: '',
      email: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNavigation = id => {
    navigation.navigate('Update_Profile', {
      userId: id,
      phoneNumber: phone,
      update: false,
    });
  };

  const teacherSignup = async () => {
    if (!validateForm()) {
      // Show toast for validation errors
      const errorMessage =
        Object.values(errors).find(error => error !== '') ||
        'Please check your form inputs';
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMessage,

        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    const url = 'signup/teachers';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const body = {
      userName: username,
      password: password,
      phoneNumber: phone,
    };

    const onResponse = async res => {
      try {
        console.log('Account created successfully');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully!',

          visibilityTime: 2000,
        });
        const teacherId = await getUserId(res.token);
        const Teachername = await getUserName(res.token);

        const userData = {
          token: `${res.token}`,
          Teacher_id: teacherId,
          Teacher_name: Teachername,
          refreshToken: res.refreshToken,
        };
        dispatch(login(userData));
        setCreateId(teacherId);
        handleNavigation(teacherId);
      } catch (error) {
        console.error('Error processing response:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const onCatch = err => {
      console.log('Error during signup:', err);
      setIsLoading(false);

      let errorMessage = 'Something went wrong. Please try again.';
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,

        visibilityTime: 4000,
      });
    };

    postApi(url, headers, body, onResponse, onCatch);
  };

  const renderError = error => {
    if (!error) return null;
    return <Text style={styles.errorText}>{error}</Text>;
  };

  return (
    <>
      <LinearGradient
        colors={['#1D49A7', '#1D49A7', '#FFF']}
        style={styles.container}>
        <StatusBar backgroundColor="#1D49A7" barStyle="light-content" />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../resources/logo.png')}
          />
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
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              {renderError(errors.phone)}

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
                  autoCapitalize="none"
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
                  autoCapitalize="none"
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
                  autoCapitalize="none"
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
                onPress={teacherSignup}
                disabled={isLoading}
                style={[
                  styles.signupButton,
                  isLoading && styles.disabledButton,
                ]}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                )}
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
      <Toast />
    </>
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
    paddingBottom: 30,
  },
  glassContainer: {
    backgroundColor: '#ffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#1D49A7',
    shadowOffset: {width: 0, height: 10},
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 15,
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
  signupButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 55,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
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

export default SignupScreen;
