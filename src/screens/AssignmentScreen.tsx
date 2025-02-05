import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BottomNavigation from '../components/BottomNavBar';

const AssignmentScreen = ({navigation}) => {
  return (
    <View style={styles.assignmentScreen}>
      <Text>AssignmentScreen</Text>
      <Text>csdvsv</Text>
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

export default AssignmentScreen;

const styles = StyleSheet.create({
  assignmentScreen: {
    flex: 1,
  },
});
