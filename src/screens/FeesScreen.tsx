import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

const FeesScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Current Month');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const summaryData = {
    totalExpected: 50000,
    totalReceived: 35000,
    balanceToReceive: 15000,
  };

  const feeRecords = [
    {
      id: 1,
      studentName: 'Kirthi Doe',
      amount: 5000,
      status: 'Paid',
      paymentDate: '2025-02-01',
    },
    {
      id: 2,
      studentName: 'Jane12 Doe12',
      amount: 5000,
      status: 'Unpaid',
      dueDate: '2025-02-15',
    },
  ];

  const monthOptions = ['Current Month', 'January', 'February', 'March'];
  const filterOptions = ['All', 'Paid', 'Unpaid'];

  const FeeCard = ({record}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FeeDetails', {feeRecord: record})}
      style={styles.feeCard}>
      <View style={styles.feeCardHeader}>
        <Text style={styles.studentName}>{record.studentName}</Text>
        <Text
          style={[
            styles.status,
            {color: record.status === 'Paid' ? '#43A047' : '#E53935'},
          ]}>
          {record.status}
        </Text>
      </View>
      <View style={styles.feeCardBody}>
        <Text style={styles.amount}>₹{record.amount.toLocaleString()}</Text>
        <Text style={styles.date}>
          {record.status === 'Paid' ? 'Paid on: ' : 'Due by: '}
          {record.paymentDate || record.dueDate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const BackgroundGraph = () => (
    <Svg height="100%" width="100%" style={styles.backgroundGraph}>
      <Defs>
        <SvgGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="rgb(105, 144, 252)" stopOpacity="0.2" />
          <Stop offset="1" stopColor="rgb(105, 144, 252)" stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Path
        d="M50,80 C100,70 150,90 200,60 C250,30 300,50 350,40"
        stroke="rgb(105, 144, 252)"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
      <Path
        d="M50,80 C100,70 150,90 200,60 C250,30 300,50 350,40 L350,120 L50,120 Z"
        fill="url(#graphGradient)"
      />
    </Svg>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fee Tracker</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.feesummeryCard}>
          <LinearGradient
            colors={['rgb(255,255,255)', 'rgb(229,235,252)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            <BackgroundGraph />
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Expected</Text>
                <Text style={styles.summaryAmount}>₹50,000</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Received</Text>
                <Text style={[styles.summaryAmount, {color: '#43A047'}]}>
                  ₹35,000
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Balance</Text>
                <Text style={[styles.summaryAmount, {color: '#E53935'}]}>
                  ₹15,000
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by student name"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}>
            {monthOptions.map(month => (
              <TouchableOpacity
                key={month}
                onPress={() => setSelectedMonth(month)}
                style={[
                  styles.filterChip,
                  selectedMonth === month && styles.selectedChip,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedMonth === month && styles.selectedChipText,
                  ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}>
            {filterOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setPaymentFilter(option)}
                style={[
                  styles.filterChip,
                  paymentFilter === option && styles.selectedChip,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    paymentFilter === option && styles.selectedChipText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.feeList}>
          {feeRecords.map(record => (
            <FeeCard key={record.id} record={record} />
          ))}
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
    // paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight + 10,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F1F4B',
  },
  container: {
    flex: 1,
  },
  feesummeryCard: {
    width: '90%',
    height: 130,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    shadowColor: 'rgb(105, 144, 252)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 20,
    marginHorizontal: '5%',
    marginTop: 20,
    overflow: 'hidden',
  },
  card: {
    height: '100%',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundGraph: {
    position: 'absolute',
    right: -25,
    bottom: -20,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F1F4B',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  filterSection: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderColor: 'rgb(0,0,0)',
    borderWidth: 0.1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
  },
  filterScrollView: {
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#0F1F4B',
  },
  filterChipText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fff',
  },
  feeList: {
    padding: 20,
  },
  feeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: 'rgb(19, 79, 243)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  feeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1F4B',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  feeCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1F4B',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default FeesScreen;
