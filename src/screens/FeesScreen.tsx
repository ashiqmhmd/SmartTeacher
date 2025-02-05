import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BottomNavigation from '../components/BottomNavBar';

const FeesScreen = ({navigation}) => {
  return (
    <View style={styles.feesScreen}>
      <Text>FeesScreen</Text>
      {/* <BottomNavigation navigation={navigation} /> */}
    </View>
  );
};

export default FeesScreen;

const styles = StyleSheet.create({
  feesScreen: {flex: 1},
});
