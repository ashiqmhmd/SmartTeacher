import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {pick} from '@react-native-documents/picker';
import {currentdate} from '../components/moment';
import {base_url} from '../utils/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postApi, putapi} from '../utils/api';

const NoteCreateScreen = ({navigation, route}) => {
  const isEditMode = route.params?.note ? true : false;
  const [note, setNote] = useState(
    isEditMode
      ? route.params.note
      : {
          Title: '',
          publishDate: currentdate(),
          content: '',
          listUrls: [],
          batchId: '',
        },
  );

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [formData, setFormData] = useState(null);
  const [attachmentList, setAttachmentList] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const [removedAttachmentUrls, setRemovedAttachmentUrls] = useState([]);
  const [update, setUpdate] = useState(false);

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const attachmentValidation = size => {
    const newErrors = {};
    if (size > 2 * 1024 * 1024) {
      newErrors.attachment = 'File size must be less than 2MB';
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!note.Title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Handle new attachments if any
      if (newAttachments.length > 0) {
        await uploadNewAttachments();
      }

      // Update or submit the note
      if (update) {
        await Note_Update();
      } else {
        await Note_Submit();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setIsSaving(false);
    }
  };

  const handleAttachments = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: ['*/*'],
      });

      if (result && result.length > 0) {
        const file = result[0];

        // Validate file size
        if (!attachmentValidation(file.size)) {
          return;
        }

        // Add to new attachments for upload
        setNewAttachments(prev => [...prev, file]);

        // Add to attachment list for display
        setAttachmentList(prev => [...prev, file]);

        // Prepare FormData for the new file
        const fileData = {
          uri:
            Platform.OS === 'android'
              ? file.uri
              : file.uri.replace('file://', ''),
          type: file.type || 'application/pdf',
          name: file.name || 'file.pdf',
        };

        const formData = new FormData();
        formData.append('file', fileData);
        setFormData(formData);
      }
    } catch (error) {
      console.error('Document Picker Error:', error);
    }
  };

  // Upload all new attachments and get their URLs
  const uploadNewAttachments = async () => {
    if (newAttachments.length === 0) return;

    try {
      const Batch_id = await AsyncStorage.getItem('batch_id');
      const Token = await AsyncStorage.getItem('Token');

      // Upload each new attachment
      const uploadPromises = newAttachments.map(async attachment => {
        // Create FormData for this attachment
        const fileData = {
          uri:
            Platform.OS === 'android'
              ? attachment.uri
              : attachment.uri.replace('file://', ''),
          type: attachment.type || 'application/pdf',
          name: attachment.name || 'file.pdf',
        };

        const formData = new FormData();
        formData.append('file', fileData);

        const url = `${base_url}uploads`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const textResponse = await response.text();
        let responseData;

        try {
          responseData = JSON.parse(textResponse);
        } catch (error) {
          console.error('Error parsing JSON response:', error);
          throw new Error('Invalid JSON response from the server');
        }

        if (!response.ok) {
          throw new Error(
            `Upload failed: ${responseData.message || 'Unknown error'}`,
          );
        }

        return responseData.url;
      });

      // Wait for all uploads to complete
      const newUrls = await Promise.all(uploadPromises);

      // Update note with new URLs
      setNote(prev => ({
        ...prev,
        batchId: Batch_id || prev.batchId,
        listUrls: [
          ...(prev.listUrls || []).filter(
            url => !removedAttachmentUrls.includes(url),
          ),
          ...newUrls.flat(),
        ],
      }));

      // Clear new attachments since they've been uploaded
      setNewAttachments([]);

      return newUrls;
    } catch (error) {
      console.error('Error during file upload:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    // Initialize attachmentList from existing note if in edit mode
    if (
      route?.params?.note?.listUrls &&
      route?.params?.note?.listUrls.length > 0
    ) {
      const existingAttachments = route.params.note.listUrls.map(url => ({
        uri: url,
        name: url.split('/').pop(),
        size: 1.5, // Placeholder size for existing files
        type: 'application/pdf', // Placeholder type
        isExisting: true, // Flag to indicate this is an existing attachment
        url: url, // Store the original URL
      }));

      setAttachmentList(existingAttachments);
    }
  }, [route?.params?.note?.listUrls]);

  useEffect(() => {
    setUpdate(route?.params?.update === true);
  }, [route?.params?.update]);

  const Note_Submit = async () => {
    const Token = await AsyncStorage.getItem('Token');
    const url = `notes`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    const body = {...note};

    const onResponse = res => {
      setNote(res);
      setIsSaving(false);
      setShowSuccessMessage(true);
      animateSuccess();
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigation.goBack();
      }, 2000);
    };

    const onCatch = res => {
      console.log('Error', res);
      setIsSaving(false);
    };

    postApi(url, headers, body, onResponse, onCatch);
  };

  const Note_Update = async () => {
    const Token = await AsyncStorage.getItem('Token');
    const url = `notes/${note.id}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    // Make sure we're sending the updated listUrls that doesn't include removed attachments
    const payload = {
      Title: note.Title,
      publishDate: note.publishDate,
      content: note.content,
      listUrls: note.listUrls,
      batchId: note.batchId,
    };

    const onResponse = res => {
      setNote(res);
      setIsSaving(false);
      setShowSuccessMessage(true);
      animateSuccess();
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigation.goBack();
      }, 2000);
    };

    const onCatch = res => {
      console.log('Error', res);
      setIsSaving(false);
    };

    putapi(url, headers, payload, onResponse, onCatch);
  };

  const handleRemoveAttachment = index => {
    const attachment = attachmentList[index];

    // Create a new array without the item at 'index'
    const newAttachmentList = attachmentList.filter((_, i) => i !== index);
    setAttachmentList(newAttachmentList);

    // If this is an existing attachment (has a URL), track it for removal
    if (attachment.isExisting && attachment.url) {
      setRemovedAttachmentUrls(prev => [...prev, attachment.url]);

      // Update the note's listUrls to remove this URL
      setNote(prev => ({
        ...prev,
        listUrls: prev.listUrls.filter(url => url !== attachment.url),
      }));
    }

    // If this is a new attachment that hasn't been uploaded yet
    if (!attachment.isExisting) {
      setNewAttachments(prev =>
        prev.filter(
          (_, i) =>
            prev[i].name !== attachment.name || prev[i].uri !== attachment.uri,
        ),
      );
    }

    // Reset any attachment errors
    if (errors.attachment) {
      setErrors(prev => ({...prev, attachment: undefined}));
    }
  };

  const renderAttachment = (item, index) => {
    const isPDF = item.type === 'application/pdf';

    return (
      <View key={index} style={styles.attachmentItem}>
        <MaterialIcons
          name={isPDF ? 'picture-as-pdf' : 'image'}
          size={20}
          color="#6B7280"
        />
        <Text style={styles.attachmentName} numberOfLines={1}>
          {item.name}
        </Text>
        <TouchableOpacity
          onPress={() => handleRemoveAttachment(index)}
          style={styles.removeAttachment}>
          <MaterialIcons name="close" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#001d3d" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>
          {isEditMode ? 'Edit Note' : 'Create Note'}
        </Text>
        <View style={{width: 24}} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {showSuccessMessage && (
            <Animated.View style={[styles.successMessage, {opacity: fadeAnim}]}>
              <MaterialIcons name="check-circle" size={24} color="#059669" />
              <Text style={styles.successText}>
                {update
                  ? 'Note updated successfully'
                  : 'Note saved successfully'}
              </Text>
            </Animated.View>
          )}

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={note.Title}
                onChangeText={text => {
                  setNote(prev => ({...prev, Title: text}));
                  if (errors.title) {
                    setErrors(prev => ({...prev, title: undefined}));
                  }
                }}
                placeholder="Enter note title"
                placeholderTextColor="#9CA3AF"
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={note.content}
                onChangeText={text =>
                  setNote(prev => ({...prev, content: text}))
                }
                placeholder="Enter note description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attachment</Text>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={handleAttachments}>
                <MaterialIcons name="attach-file" size={24} color="#6B7280" />
                <Text style={styles.attachmentButtonText}>
                  Add PDF or Image (max 2MB)
                </Text>
              </TouchableOpacity>

              {attachmentList.map((item, index) =>
                renderAttachment(item, index),
              )}

              {errors.attachment && (
                <Text style={styles.errorText}>{errors.attachment}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Note</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001d3d',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001d3d',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  attachmentButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachmentName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  removeAttachment: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#001d3d',
    shadowColor: '#001d3d',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  successText: {
    marginLeft: 8,
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NoteCreateScreen;
