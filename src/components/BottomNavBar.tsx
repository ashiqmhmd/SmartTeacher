import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import FeesScreen from '../screens/FeesScreen';
import AssignmentScreen from '../screens/AssignmentScreen';
import ChatsScreen from '../screens/ChatsScreen';
import NotesScreen from '../screens/NotesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
export type BottomTabParamsList = {
  Home: undefined;
  Fee: undefined;
  Assignment: undefined;
  Chats: undefined;
  Notes: undefined;
};

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();

  const TabBarBackground = focused => (
    <View
      style={{
        backgroundColor: focused ? 'rgba(0, 0, 255, 0.2)' : 'transparent', // Light blue when active
        padding: 50, // Space around the icon
        borderRadius: 50, // Circular shape
      }}></View>
  );
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: props => (
          <TouchableOpacity
            activeOpacity={0.7} // Controls the press effect visibility
            {...props}
          />
        ),
        tabBarIcon: ({focused, color, size}) => {
          TabBarBackground(focused);
          if (route.name === 'Home') {
            return (
              <Ionicons
                name={'home-outline'}
                size={24}
                color={focused ? 'rgb(53, 104, 244)' : '#666'}
              />
            );
          } else if (route.name == 'Fee') {
            return (
              <Ionicons
                name={'receipt-outline'}
                size={24}
                color={focused ? 'rgb(53, 104, 244)' : '#666'}
              />
            );
          } else if (route.name == 'Assignment') {
            return (
              <Ionicons
                name={'clipboard-outline'}
                size={24}
                color={focused ? 'rgb(53, 104, 244)' : '#666'}
              />
            );
          } else if (route.name == 'Notes') {
            return (
              <Ionicons
                name={'book-outline'}
                size={24}
                color={focused ? 'rgb(53, 104, 244)' : '#666'}
              />
            );
          } else if (route.name == 'Chats') {
            return (
              <Ionicons
                name={'chatbubbles-outline'}
                size={24}
                color={focused ? 'rgb(53, 104, 244)' : '#666'}
              />
            );
          }
        },
        tabBarStyle: {
          position: 'absolute',
          width: '90%', // Adjust as needed
          height: 60,
          bottom: 20,
          marginHorizontal: '5%',
          borderRadius: 50, // Rounded corners for a floating effect
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(241, 240, 250)',
          elevation: 20, // Android shadow
          shadowColor: '#000', // iOS shadow
          // shadowOffset: {width: 0, height: 4},
          shadowOpacity: 1,
          shadowRadius: 12,
        },

        tabBarActiveTintColor: 'rgb(53, 104, 244)',
        tabBarIconStyle: {marginTop: 10},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fee" component={FeesScreen} />
      <Tab.Screen name="Assignment" component={AssignmentScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Chats" component={SignUpScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    alignItems: 'center',
  },
  navigationBar: {
    width: '90%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgb(241, 240, 250)',
    borderRadius: 50,
    paddingVertical: 15,
    shadowColor: '#000',
    elevation: 20,
  },
});

export default BottomTabNavigator;
