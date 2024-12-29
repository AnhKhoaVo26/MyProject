import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { apiUrlCart } from '../other/apiCofig'; // Import API URL for cart
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const CartScreen = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${apiUrlCart}?userId=${userId}`);
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checking out.');
      return;
    }
    navigation.navigate("PayingScreens", { totalPrice: totalPrice, cartItems: cartItems });
  };
  

  const removeItemFromCart = async (productId) => {
    try {
      await axios.delete(`${apiUrlCart}/${productId}`);
      const updatedCartItems = cartItems.filter(item => item._id !== productId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartMessage}>Your cart is empty.</Text>
        ) : (
          <>
            {cartItems.map((item) => (
              <View key={item._id} style={styles.productInfoContainer}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.price}>Price: {item.price} VND</Text>
                </View>
                <TouchableOpacity onPress={() => removeItemFromCart(item._id)}>
                   <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>

              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Items: {cartItems.length}</Text>
              <Text style={styles.totalText}>Total Price: {totalPrice.toLocaleString('vi-VN')} VND</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 10,
    paddingTop: 40
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: 160,
    height: 100,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 17,
    color: 'green',
    marginBottom: 5,
  },
  removeButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'green',

  },
  checkoutButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
