import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BottomNavigation from '../components/BottomNavBar';

const NotesScreen = ({navigation}) => {
  return (
    <View style={styles.notesScreen}>
      <Text>NotesScreen</Text>
      {/* <BottomNavigation navigation={navigation} /> */}
    </View>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  notesScreen: {flex: 1},
});
