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
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { base_url } from '../utils/store';

const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('TEACHER');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    general: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      general: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

const handleResetPassword = async () => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setErrors({ ...errors, general: '' });

  try {
    // const query = `?userName=${encodeURIComponent(username.trim())}&userType=TEACHER`;
    const url = `${base_url}login/new-password?userName=${username.trim()}&userType=${userType}`;

    const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
});

const contentType = response.headers.get('Content-Type');

const rawText = await response.text(); // Get raw text before parsing

console.log('Raw response:', rawText);

if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
}

if (!contentType || !contentType.includes('application/json')) {
  throw new Error('Unexpected response type. Expected JSON.');
}

const data = JSON.parse(rawText); // Safe to parse now

    setLoading(false);

    if (response.ok) {
      setEmailSent(true);
    } else {
      setErrors({
        ...errors,
        general: data.message || 'Failed to process your request',
      });
    }
  } catch (error) {
    setLoading(false);
    setErrors({
      ...errors,
      general: 'Network error. Please try again later.',
    });
    console.error('Reset password error:', error);
  }
};


  const renderError = error => {
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
            {emailSent ? (
              <View style={styles.successContainer}>
                <Text style={styles.title}>Email Sent!</Text>
                <Text style={styles.successMessage}>
                  A password reset link has been sent to your email address. Please check your inbox and follow the instructions.
                </Text>
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.returnButtonText}>Return to Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                 Enter your username and we'll send a password reset link to your email address
                </Text>

                {renderError(errors.general)}

                <View
                  style={[
                    styles.inputContainer,
                    errors.username && styles.inputError,
                  ]}>
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
                    onChangeText={text => {
                      setUsername(text);
                      setErrors({ ...errors, username: '', general: '' });
                    }}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
                {renderError(errors.username)}

             

                <TouchableOpacity
                  onPress={handleResetPassword}
                  style={[
                    styles.resetButton,
                    loading && styles.resetButtonDisabled,
                  ]}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.resetButtonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                  disabled={loading}>
                  <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </>
            )}
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
    marginTop: '20%',
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
    shadowOffset: { width: 0, height: 10 },
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
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },

  resetButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    marginTop:15,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1D49A7',
    textDecorationLine: 'underline',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successMessage: {
    fontSize: 14,
    color: '#001d3d',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 20,
  },
  returnButton: {
    backgroundColor: '#001d3d',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPassword;