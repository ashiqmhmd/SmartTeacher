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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const TrendySignupScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState(null);

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

            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color="#001d3d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color="#001d3d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

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

            {/* <View style={styles.inputContainer}>
              <Feather
                name="map-pin"
                size={20}
                color="#001d3d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />
            </View> */}

            {/* <View style={styles.inputContainer}>
              <Feather
                name="map"
                size={20}
                color="#001d3d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#888"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
              />
            </View> */}

            {/* <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <View style={styles.genderOptions}>
                {['Male', 'Female', 'Transgender', 'Other'].map(
                  genderOption => (
                    <TouchableOpacity
                      key={genderOption}
                      style={[
                        styles.genderButton,
                        gender === genderOption && styles.selectedGender,
                      ]}
                      onPress={() => setGender(genderOption)}>
                      <Text style={styles.genderButtonText}>
                        {genderOption}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View> */}

            <TouchableOpacity style={styles.signupButton}>
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
    marginBottom: 50,
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
