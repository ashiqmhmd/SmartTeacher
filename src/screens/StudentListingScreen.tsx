import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet, FlatList, RefreshControl, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { getapi } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons';
const StudentListing = ({ navigation }) => {

    const [students, setStudents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const selectedBatchString = useSelector(state => state.auth?.selectBatch);
    const selectedBatch_id = useSelector(state => state.auth?.batch_id);
    const [loading, setLoading] = useState(true);


    const students_fetch = async () => {
        setLoading(true);
        const Token = await AsyncStorage.getItem('Token');
        const Batch_id = await AsyncStorage.getItem('batch_id');
        const url = `students/batch/${Batch_id ? Batch_id : selectedBatch_id}`;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Token}`,
        };
        const onResponse = res => {
            setStudents(res || []);
            setLoading(false);
            setRefreshing(false);
        };

        const onCatch = res => {
            console.error('Error fetching students:', res);
            setLoading(false);
            setStudents([]);
            setRefreshing(false);
        };
        getapi(url, headers, onResponse, onCatch);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        students_fetch();
    }, []);

    useEffect(() => {
        students_fetch()
    }, [1])

    const renderStudentCard = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.listCard}
                onPress={() => navigation.navigate('Student_Detail', { student: item })}>
                {item.profilePicUrl != null ? (
                    <Image source={{ uri: item.profilePicUrl }} style={styles.profilePic} />
                ) : (
                    <View style={styles.noPicContainer}>
                        <Image
                            source={require('../resources/user.png')}
                            style={styles.noPic}
                        />
                    </View>
                )}
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.studentName}>
                        {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.parentDtl}>Parent: {item.parent1Name}</Text>
                    <Text style={styles.parentDtl}>Phone No: {item.parent1Phone}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={24} color="#666" />
                    <TextInput
                        placeholder="Search Student"
                        placeholderTextColor="#666"
                        style={styles.searchInput}
                    />
                </View>
            </View>
            {students.length === 0 ? (
                <View style={styles.noStudentsContainer}>
                    <FontAwesome name="user" size={48} color="#ccc" />
                    <Text style={styles.noStudentsText}>No students in this batch</Text>
                </View>
            ) : (
                <FlatList
                    data={students}
                    renderItem={renderStudentCard}
                    keyExtractor={(item) => item.firstName}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#001d3d']}
                            tintColor="#001d3d"
                        />
                    }
                />
            )
            }
        </View>

    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)',
        marginVertical:"5%"
      },
    listCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#1D49A7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    noPicContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(229,235,252)',
    },
    noPic: {
        width: 30,
        height: 30,
        opacity: 0.5,
    },
    studentName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    parentDtl: {
        fontSize: 12,
        color: 'rgb(162, 160, 160)',
    },
    noStudentsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noStudentsText: {
        fontSize: 18,
        color: '#888',
    },
    list: {
        padding: 3,
        marginHorizontal: '5%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: '5%',
      },
      searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderColor: 'rgb(0,0,0)',
        borderWidth: 0.1,
        borderRadius: 25,
        paddingHorizontal: 15,
        flex: 1,
      },
      searchInput: {
        marginLeft: 10,
        fontSize: 16,
        color: 'rgb(51,51,51)',
      },
})

export default StudentListing