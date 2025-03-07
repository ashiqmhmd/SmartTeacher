import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {getapi, postapi} from '../utils/api';
import dateconvert from '../components/moment';

const FeePaymentDetailsScreen = ({route, navigation}) => {
  const {feeRecord, name} = route.params;
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMarkAsReceived = async () => {
    setIsSaving(true);
    try {
      // API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Fee payment marked as received');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment status');
    } finally {
      setIsSaving(false);
    }
  };

  const isImageFile = url => {
    if (!url) return false;
    const lowerCaseUrl = url.toLowerCase();
    return (
      lowerCaseUrl.endsWith('.jpg') ||
      lowerCaseUrl.endsWith('.jpeg') ||
      lowerCaseUrl.endsWith('.png') ||
      lowerCaseUrl.endsWith('.gif')
    );
  };

  const isPdfFile = url => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
  };

  const openPdfFile = url => {
    Linking.openURL(url);
  };

  const renderAttachment = () => {
    if (!feeRecord.attachmentUrl) {
      return (
        <Text style={styles.noAttachmentText}>No payment proof available</Text>
      );
    }

    if (isImageFile(feeRecord.attachmentUrl)) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: feeRecord.attachmentUrl}}
            style={styles.paymentProofImage}
            resizeMode="contain"
          />
        </View>
      );
    } else if (isPdfFile(feeRecord.attachmentUrl)) {
      return (
        <TouchableOpacity
          style={styles.pdfContainer}
          onPress={() => openPdfFile(feeRecord.attachmentUrl)}>
          <MaterialIcons name="picture-as-pdf" size={38} color="#E53935" />
          <Text style={styles.pdfText}>View PDF Document</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.unknownFileContainer}
          onPress={() => Linking.openURL(feeRecord.attachmentUrl)}>
          <MaterialIcons name="insert-drive-file" size={48} color="#001d3d" />
          <Text style={styles.fileText}>View Attachment</Text>
        </TouchableOpacity>
      );
    }
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

          <View style={styles.emptyView} />
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
            <Text style={styles.value}>{name}</Text>
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
            <>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Payment Date</Text>
                <Text style={styles.value}>
                  {dateconvert(feeRecord.paymentDate)}
                </Text>
              </View>

              <View style={styles.attachmentSection}>
                <Text style={styles.attachmentTitle}>Payment Proof</Text>
                {renderAttachment()}
              </View>
            </>
          )}
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
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    padding: 8,
    borderRadius: 12,

    width: 40,
    height: 40,
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
  imageContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  paymentProofImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  pdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pdfText: {
    fontSize: 16,
    color: '#001d3d',
    fontWeight: '500',
    marginLeft: 16,
  },
  unknownFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  fileText: {
    fontSize: 16,
    color: '#001d3d',
    fontWeight: '500',
    marginLeft: 16,
  },
  noAttachmentText: {
    color: '#666',
    fontStyle: 'italic',
    padding: 12,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeePaymentDetailsScreen;
