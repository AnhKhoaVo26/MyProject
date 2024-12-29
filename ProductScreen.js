import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { apiUrlProduct, apiUrlCart } from '../other/apiCofig';
const ProductScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrlProduct);
        setProducts(response.data);
        setFilteredProducts(response.data);
        setFavoriteStatus(new Array(response.data.length).fill(false));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const handleToggleFavorite = (index) => {
    let newFavoriteStatus = [...favoriteStatus];
    newFavoriteStatus[index] = !newFavoriteStatus[index];
    setFavoriteStatus(newFavoriteStatus);
  };

  const handleAddToCart = async (product) => {
    setSelectedItems([...selectedItems, product]);
    try {
      await axios.post(`${apiUrlCart}?userId=${userId}`, product);
      navigation.navigate('CartScreen');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const goToCart = () => {
    navigation.navigate('CartScreen', { selectedItems });
  };

  const goToProductDetail = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const totalQuantityInCart = selectedItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search products"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={true}>
        {filteredProducts.map((product, index) => (
          <TouchableOpacity key={index} style={styles.touchableOpacity} onPress={() => goToProductDetail(product)}>
            <View style={styles.cardContainer}>
              <Image source={{ uri: product.images[0] }} style={styles.cardImages} resizeMode="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.productName}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <TouchableOpacity onPress={() => handleToggleFavorite(index)} style={styles.favoriteIconContainer}>
                  <Icon name="heart" size={20} color={favoriteStatus[index] ? 'red' : '#000'} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleAddToCart(product)} style={styles.addToCartButton}>
                <Text style={styles.addToCartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={goToCart} style={styles.goToCartButton}>
        <Icon name="shopping-cart" size={24} color="white" />
        {totalQuantityInCart > 0 && <Text style={styles.cartItemCount}>{totalQuantityInCart}</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  touchableOpacity: {
    marginBottom: 10,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImages: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productInfo: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  favoriteIconContainer: {
    marginLeft: 10,
  },
  addToCartButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addToCartButtonText: {
    color: 'white',
  },
  goToCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemCount: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
});

export default ProductScreen;
