// Import các thư viện cần thiết và styles
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo/vector-icons
import axios from 'axios';
import { apiUrlOrder } from '../other/apiCofig';

const PayingScreen = () => {
  const [isPaid, setIsPaid] = useState(true); // Trạng thái để hiển thị giao diện đã thanh toán
  const navigation = useNavigation();
  const route = useRoute();
  const { totalPrice, cartItems, orderDate, shipDate } = route.params; // Fetch orderDate and shipDate from route params

  const handlePayment = async (paymentMethod) => {
    if (paymentMethod === 'card') {
      // Proceed with card payment
      await processCardPayment();
    } else {
      // Proceed with cash payment
      await processCashPayment();
    }
  };

  const processCardPayment = async () => {
    console.log('Processing card payment...');
    // For example, you can display a confirmation message
    Alert.alert('Payment Successful', 'Card payment processed successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const processCashPayment = async () => {
    // Implement cash payment logic here
    try {
      const response = await axios.post(apiUrlOrder, {
        OrderDate: orderDate,
        ShipDate: shipDate,
        TotalAmount: totalPrice,
        products: cartItems.map(item => item._id)
      });
      console.log('Order placed successfully:', response.data);
      Alert.alert('Payment Successful', 'Cash payment processed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('CartScreens') }
      ]);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh Toán</Text>
      
      <TouchableOpacity
        style={[styles.optionButton, styles.cardButton]}
        onPress={() => handlePayment('card')}
      >
        <FontAwesome name="credit-card" size={24} color="#fff" />
        <Text style={styles.optionButtonText}>Thanh Toán bằng thẻ ngân hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, styles.cashButton]}
        onPress={() => handlePayment('cash')}
      >
        <FontAwesome name="money" size={24} color="#fff" />
        <Text style={styles.optionButtonText}>Thanh Toán bằng tiền mặt</Text>
      </TouchableOpacity>
      
      {/* Hiển thị giao diện đã thanh toán nếu trạng thái isPaid là true */}
      {isPaid && (
        <View style={styles.totalContainer}>
          <TouchableOpacity >
            <FontAwesome name="shopping-cart" size={24} color="#333" style={styles.cartIcon} />
          </TouchableOpacity>
          <View>
              <Text style={styles.dateLabel}>Ngày đặt hàng: {orderDate}</Text>
              <Text style={styles.dateLabel}>Ngày giao hàng: {shipDate}</Text>
              <Text style={styles.totalText}>Tổng số mặt hàng: {cartItems ? cartItems.length : 0}</Text>
              <Text style={styles.totalText}>Tổng giá: {totalPrice ? totalPrice.toLocaleString('vi-VN') : '0'} VND</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Style cho các phần tử
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Màu chữ
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666', // Màu chữ
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardButton: {
    backgroundColor: '#4CAF50', // Màu nền
  },
  cashButton: {
    backgroundColor: '#2196F3', // Màu nền
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cartIcon: {
    marginRight: 20,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // Màu chữ
  },
});

export default PayingScreen;
