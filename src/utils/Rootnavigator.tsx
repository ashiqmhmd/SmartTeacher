import SignUpScreen from '../screens/SignUpScreen';
import NotesScreen from '../screens/NotesScreen';
import ChatsScreen from '../screens/ChatsScreen';
import BottomTabNavigator from '../components/BottomNavBar';
import StudentRegistrationForm from '../components/Student_Create';
import Batch_creation from '../components/Batch_Creation';
import EditAssignment from '../screens/AssignmentEdit';
import CreateAssignment from '../screens/AssignmentCreation';
import NotificationScreen from '../screens/NotificationScreen';
import HomeScreen from '../screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FeesScreen from '../screens/FeesScreen';
import AssignmentsScreen from '../screens/AssignmentScreen';
import LoginScreen from '../screens/LoginScreen';
import {useSelector} from 'react-redux';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import NoteCreateScreen from '../screens/NoteCreateScreen';

type Props = {};

export type RootStackParamsList = {
  tabs: undefined;
};

const Rootnavigator = () => {
  const Stack = createNativeStackNavigator();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  // const Token = useSelector((state) => state.auth.token);
  // console.log(isLoggedIn);
  // console.log(Token)

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Tabs' : 'Login'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Update_Profile" component={UpdateProfileScreen} />
      <Stack.Screen name="Fees" component={FeesScreen} />
      <Stack.Screen name="Assignment" component={AssignmentsScreen} />
      <Stack.Screen name="Assignment_Edit" component={EditAssignment} />
      <Stack.Screen name="Assignment_Creation" component={CreateAssignment} />
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="Note_Create" component={NoteCreateScreen} />
      <Stack.Screen name="Chats" component={ChatsScreen} />
      <Stack.Screen name="Student_Create" component={StudentRegistrationForm} />
      <Stack.Screen name="Batch_Create" component={Batch_creation} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default Rootnavigator;
