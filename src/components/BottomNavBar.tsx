import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavigation = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: 'Home',
      icon: 'home-outline',
      route: 'Home',
    },
    {
      name: 'Fee',
      icon: 'receipt-outline',
      route: 'Home',
    },
    {
      name: 'Assignment',
      icon: 'clipboard-outline',
      route: 'Home',
    },
    {
      name: 'Notes',
      icon: 'book-outline',
      route: 'Home',
    },
    {
      name: 'Chats',
      icon: 'chatbubbles-outline',
      route: 'Home',
    },
  ];

  const handleTabPress = (index, route) => {
    setActiveTab(index);
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => handleTabPress(index, tab.route)}>
            <Ionicons
              name={tab.icon}
              size={24}
              color={activeTab === index ? 'rgb(53, 104, 244)' : '#666'}
            />
            {/* <Text style={styles.tabText}>{tab.name}</Text> */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  navigationBar: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgb(241, 240, 250)',
    borderRadius: 50,
    paddingVertical: 15,
    shadowColor: '#000',
    // shadowOffset: {width: 0, height: 4},
    // shadowOpacity: 1,
    // shadowRadius: 12,
    elevation: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(53, 104, 244, 0.2)',
  },
});

export default BottomNavigation;
