import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { postApi } from '../utils/api';
import { login } from '../utils/authslice';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()

  const Teacher_Login = () => {
    const url = 'login/teacher';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
     const body = {
      userName:username,
      password:password
     }
    const onResponse = res => {
        const userData = {
            token: res.token,
          };
          console.log(userData)
          dispatch(login(userData)); // Dispatch the login action
          navigation.replace('Tabs');
    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);
    };

    postApi(url,headers,body,onResponse,onCatch)

  }


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
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Login to your account to Continue
            </Text>

            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color="#001d3d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>  Teacher_Login()}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLinkText}>Sign Up</Text>
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
    marginTop: '30%',
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
    flexGrow: 0.5,
    justifyContent: 'center',
    paddingHorizontal: '5%',
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
    textAlign: 'center',
    color: '#001d3d',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#001d3d',
    textAlign: 'center',
    marginBottom: 50,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#1D49A7',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#001d3d',
  },
  signupLinkText: {
    color: '#1D49A7',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
