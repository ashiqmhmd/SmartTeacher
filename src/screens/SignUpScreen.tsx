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
  Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const ColorVariants = {
  PURPLE_BLUE: ['#6a11cb', '#2575fc'],
  SUNSET: ['#ff6b6b', '#ff9a9e'],
  OCEAN: ['#00b4db', '#0083b0'],
  FOREST: ['#11998e', '#38ef7d'],
  DAWN: ['#ff6a88', '#ff99ac']
};

const TrendySignupScreen = () => {
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
      colors={['#4158D0', '#FFF']} 
      style={styles.container}
    >
     
   

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
           <View style={{justifyContent:"center",alignItems:"center",}}>
        <Image style={{width:110,height:100}} source={require("../resources/logo.png")}/>
      </View>
          <View style={styles.glassContainer}>
            
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Smart Teacher</Text>

            <View style={styles.nameContainer}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Feather name="user" size={20} color="#6a11cb" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#888"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Feather name="user" size={20} color="#6a11cb" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#888"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6a11cb" style={styles.inputIcon} />
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
              <Feather name="lock" size={20} color="#6a11cb" style={styles.inputIcon} />
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
                style={styles.showPasswordIcon}
              >
                <Feather 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={20} 
                  color="#6a11cb" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={20} color="#6a11cb" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map" size={20} color="#6a11cb" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#888"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <View style={styles.genderOptions}>
                {['Male', 'Female', 'Transgender', 'Other'].map((genderOption) => (
                  <TouchableOpacity 
                    key={genderOption}
                    style={[
                      styles.genderButton,
                      gender === genderOption && styles.selectedGender
                    ]}
                    onPress={() => setGender(genderOption)}
                  >
                    <Text style={styles.genderButtonText}>{genderOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity>
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
  colorChangeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  glassContainer: {
    backgroundColor: '#fffafa',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.125)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4158D0',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4158D0',
    textAlign: 'center',
    marginBottom: 30,
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
  halfInput: {
    width: '48%',
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
    color: '#4158D0',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    height:50,
    justifyContent:"center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginHorizontal: 3,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#4158D0' },
  genderButtonText: {
    color: 'white',
  },
  signupButton: {
    backgroundColor: '#4158D0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
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
    color: 'rgba(255,255,255,0.7)',
  },
  loginLinkText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrendySignupScreen;