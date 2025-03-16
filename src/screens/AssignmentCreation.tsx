import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { pick } from '@react-native-documents/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../utils/store';
import { postApi, putapi } from '../utils/api';
import { currentdate } from '../components/moment';
import moment from 'moment';
import { batch_id } from '../utils/authslice';


const CreateAssignment = ({ navigation, route }) => {
  const isEditMode = route.params?.assignment ? true : false;
  const [assignment, setAssignment] = useState(
    isEditMode ?
      route.params.assignment
      :
      {
        publishDate: currentdate(),
        title: '',
        submissionDate: new Date(),
        attachmentUrls: [],
        batchId: '',
        details: ''
      });



  const [submissionDate, setSubmitdate] = useState(new Date())
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formdatas, setformdata] = useState()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [attachmentList, setAttachmentList] = useState([]);
  const [update, setUpdate] = useState(false)
  const [updateAttachment, setUpdateAttachment] = useState(false)
  useEffect(() => {
    console.log('useEffect triggered:', route?.params?.assignment?.attachmentUrls);
    const date = route?.params?.assignment?.submissionDate

    if (date instanceof Date || typeof date === 'string') {
      const dateObject = new Date(date); // Convert string to Date
      if (!isNaN(dateObject.getTime())) {
        setSubmitdate(dateObject); // Only set the date if it's valid
      } else {
        console.error("Invalid date string:", date);
      }
    }
    if (route?.params?.assignment?.attachmentUrls) {
      const mappedAttachments = route?.params?.assignment?.attachmentUrls.map((url) => ({
        uri: url,
        name: url.split('/').pop(),
        size: 1.5,
        type: 'application/pdf',
      }));



      if (JSON.stringify(mappedAttachments) !== JSON.stringify(attachmentList)) {
        console.log('Updating attachmentList');
        setAttachmentList(mappedAttachments);
        const formData = new FormData();
        formData.append('file', mappedAttachments);

        console.log("FormData Object:", mappedAttachments);

        // Save Image & FormData
        setformdata(mappedAttachments); // Store FormData directly, NOT as JSON!
        // setSubmitdate(date)
      }
    }
  }, [route?.params?.assignment?.attachmentUrls]);
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

  useEffect(() => {
    setUpdate(route.params.update)
  }, [route.params.update])

  const getDateObject = (date) => {
    if (!date) return new Date(); // Fallback to current date if null or undefined
    return typeof date === 'string' ? new Date(date) : date; // Convert string to Date object
  };


  const attachmentValidation = size => {
    console.log(size);
    const newErrors = {};
    console.log(size > 2 * 1024 * 1024);
    if (size > 2 * 1024) {
      newErrors.attachment = 'File size must be less than 2MB';
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!assignment.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!assignment.submissionDate) {
      newErrors.submissionDate = 'Submission date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Fetch Batch_id from AsyncStorage
      const Batch_id = await AsyncStorage.getItem('batch_id');
      if (!Batch_id) {
        console.warn("Batch_id is not available!");
        setIsSaving(false);
        return;
      }

      // Update assignment state with Batch_id
      await new Promise((resolve) => {
        setAssignment((prev) => ({
          ...prev,
          batchId: Batch_id,
        }));
        resolve();
      });
      if (update && updateAttachment) {
        // Upload the file
        await fileupload();
      }
      else if (!update && updateAttachment) {
        await fileupload();

      }
      else if (update) {
        await Assignment_Update();
      }



      // Show success message and reset state
      setIsSaving(false);
      setShowSuccessMessage(true);
      animateSuccess();
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error during save:", error.message);
      setIsSaving(false);
    }
  };

  const handleAttachments = async () => {

    try {
      const result = await pick({
        allowMultiSelection: false,
        type: ['*/*'],
      });

      if (result) {
        console.log('Document selected:', result);
        let size = result[0].size;
        // setAttachmentList(prev => ({
        //   ...prev,
        //   attachments: [
        //     ...(prev.attachments || []),
        //     ...(Array.isArray(result) ? result : [result]),
        //   ],
        // }));
        if (update) {
          setUpdateAttachment(true)
        }
        else if (!update) {
          setUpdateAttachment(true)

        }

        setAttachmentList(prev => [
          ...prev,
          ...(Array.isArray(result) ? result : [result]),
        ]);

        attachmentValidation(size);
        const fileData = {
          uri: Platform.OS === 'android' ? result[0].uri : result[0].uri.replace('file://', ''),
          type: result[0].type || ' application/pdf',
          name: result[0].name || 'file.pdf',
        };

        console.log("File Data Before Append:", fileData);

        // Create FormData
        const formData = new FormData();
        formData.append('file', fileData);

        console.log("FormData Object:", formData);

        // Save Image & FormData
        setformdata(formData); // Store FormData directly, NOT as JSON!
      }

    } catch (error) {
      console.error('Document Picker Error:', error);
    }
  };


  const fileupload = async () => {
    try {
      console.log("Uploading file...");

      const Batch_id = await AsyncStorage.getItem('batch_id');
      const Token = await AsyncStorage.getItem('Token');

      if (!formdatas) {
        console.warn("No file selected for upload!");
        return;
      }

      if (Batch_id) {
        setAssignment(prev => ({
          ...prev,
          batchId: Batch_id,
        }))
      }

      const url = `${base_url}uploads`;

      console.log("Uploading Image to:", url);
      console.log("FormData Before Upload:", formdatas);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formdatas,
      });

      console.log("Status Code:", response.status);

      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);

      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error("Invalid JSON response from the server");
      }

      if (!response.ok) {
        throw new Error(`Upload failed: ${responseData.message || "Unknown error"}`);
      }

      console.log("Batch_id:", Batch_id);
      console.log("Upload Successful!", responseData.url);

      // ✅ Update assignment state (attachments → attachmentUrls)
      setAssignment(prev => ({
        ...prev,
        batchId: Batch_id,
        attachmentUrls: [
          ...(prev.attachmentUrls || []),
          ...(Array.isArray(responseData.url) ? responseData.url : [responseData.url]),
        ],
      }));

      // ✅ Trigger assignment submission
      update ?
        Assignment_Update()
        :
        Assignment_Submit()

      return responseData.url;
    } catch (error) {
      console.error("Error during file upload:", error.message);
    }
  };


  const Assignment_Submit = async () => {

    const Token = await AsyncStorage.getItem('Token');


    const url = `assignments`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    const body = {
      ...assignment,
    }
    const onResponse = res => {
      setAssignment(res);
      navigation.goBack()

    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);

    };
    postApi(url, headers, body, onResponse, onCatch);
    console.log(body)
  };

  const Assignment_Update = async () => {

    const Token = await AsyncStorage.getItem('Token');


    const url = `assignments/${assignment.id}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    const payload = {
      publishDate: assignment.publishDate,
      title: assignment.title,
      submissionDate: assignment.submissionDate,
      attachmentUrls: assignment.attachmentUrls,
      batchId: assignment.batchId,
      details: assignment.details
    };
    const onResponse = res => {
      setAssignment(res);
      navigation.goBack()

    };

    const onCatch = res => {
      console.log('Error');
      console.log(res);

    };
    putapi(url, headers, payload, onResponse, onCatch);
    console.log(payload)
  };


  const renderAttachmentItem = (item, index) => (
    <View style={styles.attachmentItem} key={index}>
      <MaterialIcons name="attachment" size={20} color="#6B7280" />
      <Text style={styles.attachmentName} numberOfLines={1}>
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={() => {
          const newErrors = {};

          // Create a new array without the item at 'index'
          const newAttachments = attachmentList.filter((_, i) => i !== index);

          // Update the attachmentList with the modified array
          setAttachmentList(newAttachments);

          // Optionally reset errors
          setErrors(newErrors);
        }}

        style={styles.removeAttachment}>
        <MaterialIcons name="close" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#001d3d" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Create Assignment</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {showSuccessMessage && (
            <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
              <MaterialIcons name="check-circle" size={24} color="#059669" />
              <Text style={styles.successText}>
                Assignment saved successfully
              </Text>
            </Animated.View>
          )}

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={assignment.title}
                onChangeText={text => {
                  setAssignment(prev => ({ ...prev, title: text }));
                  if (errors.title)
                    setErrors(prev => ({ ...prev, title: undefined }));
                }}
                placeholder="Enter assignment title"
                placeholderTextColor="#9CA3AF"
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Submission Date *</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                  {submissionDate.toLocaleDateString()}
                </Text>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
              {errors.submissionDate && (
                <Text style={styles.errorText}>{errors.submissionDate}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={assignment.details}
                onChangeText={text =>
                  setAssignment(prev => ({ ...prev, details: text }))
                }
                placeholder="Enter assignment description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attachments</Text>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={handleAttachments}>
                <MaterialIcons name="attach-file" size={24} color="#6B7280" />
                <Text style={styles.attachmentButtonText}>Add Attachments</Text>
              </TouchableOpacity>
              <View style={styles.attachmentsList}>
                {attachmentList.map((item, index) =>
                  renderAttachmentItem(item, index),
                )}
                {errors.attachment && (
                  <Text style={styles.errorText}>{errors.attachment}</Text>
                )}
              </View>
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
              <Text style={styles.saveButtonText}>Save Assignment</Text>
            )}
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={getDateObject(assignment?.submissionDate || submissionDate)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              const formattedDate = moment(selectedDate ? selectedDate : "")
                .utc()
                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
                .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

              if (selectedDate) {
                setAssignment(prev => ({
                  ...prev,
                  submissionDate: formattedDate,
                }));
                setSubmitdate(selectedDate)
                console.log(selectedDate.toLocaleDateString())
              }
            }}
          />
        )}
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
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
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
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
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
    shadowOffset: { width: 0, height: -2 },
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
    shadowOffset: { width: 0, height: 2 },
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

export default CreateAssignment;
