import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getapi, postapi} from '../utils/api';
import dateconvert from '../components/moment';

const FeePaymentDetailsScreen = ({route, navigation}) => {
  const {feeRecord} = route.params;
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMarkAsReceived = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      Alert.alert('Success', 'Fee payment marked as received');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotify = async () => {
    try {
      const message = `${
        feeRecord.studentName
      }'s fee payment is pending for month ${dateconvert(
        feeRecord.dueDate,
      )}. Please pay it asap. Ignore if already paid.`;
      // API call to send notification would go here
      Alert.alert('Success', 'Notification sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Fee Payment Details for ${feeRecord.studentName}`,
        title: 'Fee Payment Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Fee Record',
      'Do you really want to delete?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // API call would go here
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete fee record');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#001d3d" barStyle="light-content" />

      <LinearGradient colors={['#001d3d', '#002855']} style={styles.header}>
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fee Payment Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <MaterialIcons name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.statusBadge}>
            <Text
              style={[
                styles.statusText,
                {color: feeRecord.status === 'paid' ? '#43A047' : '#E53935'},
              ]}>
              {feeRecord.status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Student Name</Text>
            <Text style={styles.value}>{feeRecord.studentName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>
              ₹{feeRecord.amount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{dateconvert(feeRecord.dueDate)}</Text>
          </View>

          {feeRecord.status === 'paid' && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Payment Date</Text>
              <Text style={styles.value}>
                {dateconvert(feeRecord.paymentDate)}
              </Text>
            </View>
          )}

          <View style={styles.attachmentSection}>
            <Text style={styles.attachmentTitle}>Attachments</Text>
            <TouchableOpacity style={styles.attachmentButton}>
              <MaterialIcons name="attach-file" size={24} color="#001d3d" />
              <Text style={styles.attachmentButtonText}>Add Attachment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {feeRecord.status !== 'paid' && (
            <TouchableOpacity
              style={[styles.button, styles.receiveButton]}
              onPress={handleMarkAsReceived}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Mark as Received</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.notifyButton]}
            onPress={handleNotify}>
            <MaterialIcons name="notifications" size={24} color="#fff" />
            <Text style={styles.buttonText}>Send Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="delete" size={24} color="#fff" />
                <Text style={styles.buttonText}>Delete Record</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shareButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#001d3d',
    fontWeight: '500',
  },
  attachmentSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  attachmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001d3d',
    marginBottom: 12,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  attachmentButtonText: {
    marginLeft: 8,
    color: '#001d3d',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  receiveButton: {
    backgroundColor: '#43A047',
  },
  notifyButton: {
    backgroundColor: '#1976D2',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeePaymentDetailsScreen;
