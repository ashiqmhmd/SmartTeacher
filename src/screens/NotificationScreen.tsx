import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationScreen = ({navigation}) => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'message',
      title: 'New Message from Parent',
      description: "Rahul's father asked about the upcoming test schedule",
      time: '2 hours ago',
      isRead: false,
      icon: 'message',
      iconColor: '#4CAF50',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Fee Payment Received',
      description: 'Priya Singh has paid ₹2000 for Mathematics Batch',
      time: '5 hours ago',
      isRead: false,
      icon: 'payments',
      iconColor: '#2196F3',
    },
    {
      id: '3',
      type: 'test',
      title: 'Test Results Updated',
      description: 'Physics Unit Test results have been attested',
      time: '1 day ago',
      isRead: true,
      icon: 'assignment',
      iconColor: '#FF9800',
    },
  ]);

  const handleNotificationPress = notification => {
    // Mark notification as read
    const updatedNotifications = notifications.map(item =>
      item.id === notification.id ? {...item, isRead: true} : item,
    );
    setNotifications(updatedNotifications);

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigation.navigate('MessageDetails', {id: notification.id});
        break;
      case 'payment':
        navigation.navigate('PaymentDetails', {id: notification.id});
        break;
      case 'test':
        navigation.navigate('TestResults', {id: notification.id});
        break;
    }
  };

  const renderNotificationCard = ({item}) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: `${item.iconColor}15`},
        ]}>
        <MaterialIcons name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="rgb(0,0,0)" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Notifications</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="rgb(0,0,0)" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
  },
  appBar: {
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: 'rgb(15, 31, 75)',
  },
  notificationList: {
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: 'rgb(105, 144, 252)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1F4B',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F1F4B',
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

export default NotificationScreen;
