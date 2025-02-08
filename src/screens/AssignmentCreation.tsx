// EditAssignment.jsx
import React, { useState, useEffect } from 'react';
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
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';
import { pick } from '@react-native-documents/picker'
// import { NativeDocumentPicker } from '@react-native-documents/picker/lib/typescript/spec/NativeDocumentPicker';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const CreateAssignment = ({ navigation }) => {
    let today = new Date();
    let date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
    const [assignment, setAssignment] = useState({
        title: '',
        publishDate: date,
        submissionDate: new Date(),
        description: '',
        attachments: []
    });

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    // Animation for success message
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
        if (!validateForm()) return;

        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setShowSuccessMessage(true);
        animateSuccess();
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

      const handleAttachments = async () => {
        // try {
        //   const result = await DocumentPicker.getDocumentAsync({
        //     type: '*/*',
        //     multiple: true,
        //   });

        //   if (result.assets) {
        //     setAssignment(prev => ({
        //       ...prev,
        //       attachments: [...prev.attachments, ...result.assets]
        //     }));
        //   }
        // } catch (err) {
        //   console.log('Document picker error:', err);
        // }

        
        try {
            const [pickResult] = await pick()
            console.log(pickResult)
            // const [pickResult] = await pick({mode:'import'}) // equivalent
            // do something with the picked file
          } catch (err: unknown) {
            // see error handling
          }
        }
        
        

    const renderAttachmentItem = (item, index) => (
        <View style={styles.attachmentItem} key={index}>
            <MaterialIcons name="attachment" size={20} color="#6B7280" />
            <Text style={styles.attachmentName} numberOfLines={1}>
                {item.name}
            </Text>
            <TouchableOpacity
                onPress={() => {
                    const newAttachments = [...assignment.attachments];
                    newAttachments.splice(index, 1);
                    setAssignment(prev => ({ ...prev, attachments: newAttachments }));
                }}
                style={styles.removeAttachment}
            >
                <MaterialIcons name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    const ConfirmationDialog = ({ visible, title, message, onConfirm, onCancel }) => {
        if (!visible) return null;

        return (
            <View style={styles.modalOverlay}>
                <AnimatedBlurView intensity={90} style={StyleSheet.absoluteFill} />
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={onCancel}>
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalConfirmButton} onPress={onConfirm}>
                            <Text style={styles.modalConfirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.scrollView}>
                {showSuccessMessage && (
                    <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
                        <MaterialIcons name="check-circle" size={24} color="#059669" />
                        <Text style={styles.successText}>Assignment saved successfully</Text>
                    </Animated.View>
                )}

                <View style={styles.formContainer}>
                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={[
                                styles.input,
                                errors.title && styles.inputError
                            ]}
                            value={assignment.title}
                            onChangeText={(text) => {
                                setAssignment(prev => ({ ...prev, title: text }));
                                if (errors.title) {
                                    setErrors(prev => ({ ...prev, title: undefined }));
                                }
                            }}
                            placeholder="Enter assignment title"
                            placeholderTextColor="#9CA3AF"
                        />
                        {errors.title && (
                            <Text style={styles.errorText}>{errors.title}</Text>
                        )}
                    </View>

                    {/* Publish Date (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Publish Date</Text>
                        <View style={[styles.input, styles.dateInput, { backgroundColor: '#F3F4F6' }]}>
                            <Text style={styles.dateText}>
                                {assignment.publishDate}
                            </Text>
                            <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
                        </View>
                    </View>

                    {/* Submission Date */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Submission Date *</Text>
                        <TouchableOpacity
                            style={[styles.input, styles.dateInput]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                {assignment.submissionDate.toLocaleDateString()}
                            </Text>
                            <MaterialIcons name="calendar-today" size={20} color="#6B7280" />
                        </TouchableOpacity>
                        {errors.submissionDate && (
                            <Text style={styles.errorText}>{errors.submissionDate}</Text>
                        )}
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={assignment.description}
                            onChangeText={(text) => setAssignment(prev => ({ ...prev, description: text }))}
                            placeholder="Enter assignment description"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Attachments */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Attachments</Text>
                        <TouchableOpacity
                            style={styles.attachmentButton}
                          onPress={() => handleAttachments()}
                        >
                            <MaterialIcons name="attach-file" size={24} color="#6B7280" />
                            <Text style={styles.attachmentButtonText}>Add Attachments</Text>
                        </TouchableOpacity>
                        <View style={styles.attachmentsList}>
                            {assignment.attachments.map((item, index) =>
                                renderAttachmentItem(item, index)
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {/* Show delete confirmation */ }}
                >
                    <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>

                <View style={styles.rightButtons}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {/* Show discard confirmation */ }}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <MaterialIcons name="check" size={24} color="#FFFFFF" />
                                <Text style={styles.saveButtonText}>Save</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    value={assignment.submissionDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setAssignment(prev => ({ ...prev, submissionDate: selectedDate }));
                        }
                    }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    successText: {
        marginLeft: 8,
        color: '#059669',
        fontSize: 16,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
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
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 16,
        color: '#1F2937',
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
        justifyContent: 'space-between',
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
    },
    rightButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    deleteButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#EF4444',
        fontWeight: '600',
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    saveButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 16,
        color: '#4B5563',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalCancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    modalCancelButtonText: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '500',
    },
    modalConfirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#2563EB',
    },
    modalConfirmButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
});

export default CreateAssignment;