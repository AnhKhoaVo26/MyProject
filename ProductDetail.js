import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductDetail = ({ route }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();

  const handleOrder = () => {
    // Logic to handle ordering the product
    Alert.alert(`Ordered ${quantity} ${product.productName}`);
  };

  const handleAddToCart = async () => {
    // Prepare data to add to the cart
    const productObject = {
      ...product, // Include all properties of the product
      quantity: quantity
    };
    navigation.navigate('CartScreen', { product: productObject });
  };

  const handleStarPress = (starNumber) => {
    setRating(starNumber);
  };

  const renderStar = (starNumber) => {
    return (
      <TouchableOpacity key={starNumber} onPress={() => handleStarPress(starNumber)}>
        <Text style={starNumber <= rating ? styles.starFilled : styles.star}>★</Text>
      </TouchableOpacity>
    );
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(renderStar(i));
    }
    return stars;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.productName}>{product.productName}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.description}>Mô Tả Sản Phẩm: {product.description}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Số Lượng:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}
          />
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Đánh giá:</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleAddToCart} style={[styles.button, styles.cartButton]}>
            <Text style={styles.buttonText}>Giỏ Hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOrder} style={[styles.button, styles.orderButton]}>
            <Text style={styles.buttonText}>Đặt Hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 25,
    color: 'green',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 20,
    marginRight: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 20,
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 30,
    color: 'gray',
  },
  starFilled: {
    fontSize: 30,
    color: 'gold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  cartButton: {
    backgroundColor: 'blue',
    marginRight: 5,
  },
  orderButton: {
    backgroundColor: 'green',
    marginLeft: 5,
  },
});

export default ProductDetail;
