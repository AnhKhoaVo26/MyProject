import React,{ useState, useEffect } from 'react';
import { View, Text,Image,ScrollView,TextInput,StatusBar,Dimensions,SafeAreaView,StyleSheet,TouchableOpacity,FlatList,ImageBackground, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as SearchIcon, AntDesign as DeleteIcon,Ionicons } from '@expo/vector-icons';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome'; // Adjust the import path as neede
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '../const/Color';
import Hot from '../const/Hot';
import { ImagePicker } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { apiUrl } from '../other/apiCofig';
import { apiUrlProduct } from '../other/apiCofig';

const Tab = createBottomTabNavigator();
//-----------------------------------------------
const UserProfile = ({ user, selectAvatarImage}) => (
  <View style={styles.container}>
      <Image source={require('../images/user.jpg')} style={styles.profileImage} />
      <TouchableOpacity style={styles.iconcontainer} onPress={selectAvatarImage}>
        <Icon name="image" size={20} style={styles.iconss} />
      </TouchableOpacity>
      <View style={styles.a}>
      <View style={styles.box}>
        <Text style={styles.subtitle}>{user.email}</Text>
        <Text style={styles.subtitle1}>{user.password}</Text>
      </View>
    </View>
    </View>
  );
  
const InformationScreen = () => {
  const [user, setUser] = useState({
    email: 'N/A',
    password: 'N/A',
  });

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      // You can also clear any other user-related data as needed

      // Navigate to the login or authentication screen
      navigation.navigate('LoginScreens'); // Replace 'Login' with the name of your login screen
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any error, if necessary
    }
  };
  // Tạo một hàm hiển thị lỗi hoặc thông báo
  const ErrorOrLoadingMessage = ({ loading, error }) => {
    if (loading) {
      return <Text>Loading...</Text>;
    } else if (error) {
      return <Text>Error: {error.message}</Text>;
    } else {
      return null;
    }
  };

  const selectUserImage = async () => {
    // Thêm xử lý chọn hình ảnh người dùng ở đây
    try {
      const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
  
      if (!result.cancelled) {
        // Lấy hình ảnh thành công
        const selectedImage = result.uri;
        console.log('Selected Image: ', selectedImage);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const selectAvatarImage = async () => {
    // Thêm xử lý chọn hình ảnh avatar ở đây
    const options = {
      width: 300,
      height: 400,
      cropping: true,
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (!response.didCancel) {
        // Lấy hình ảnh thành công
        const selectedImage = response.uri;
        console.log('Selected Image: ', selectedImage);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve email from AsyncStorage (if available)
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');

        if (storedEmail  ) {
          setUser((prevUser) => ({
            ...prevUser,
            email: storedEmail,
          }));
        }
        if (storedPassword  ) {
          setUser((prevUser) => ({
            ...prevUser,
            password: storedPassword,
          }));
        }
        
  
        // Fetch user data from the API
        const response = await axios.get(apiUrl);
        const userData = response.data;
  
        if (userData && userData.email, userData && userData.password  ) {
          // Update the user data with both email and name
          setUser({
            email: userData.email,
            password:  userData.password
          });
  
          // Store email in AsyncStorage
          await AsyncStorage.setItem('email', userData.email);
          await AsyncStorage.setItem('password', userData.password);

        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <ScrollView style={styles.appContainer}>
      <View style={styles.contentContainer}>
        <Image source={require('../images/avata.jpg')} style={styles.backgroundImage} />
        <TouchableOpacity style={styles.icons} onPress={selectUserImage}>
          <Icon name="image" size={20} style={styles.icon}  />
        </TouchableOpacity>
        
        <View style={styles.userProfileContainer}>
          <ErrorOrLoadingMessage loading={loading} error={error} />
          <UserProfile user={user} selectAvatarImage={selectAvatarImage} />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>History</Text>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Love </Text>
            <Ionicons name="heart-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} /> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Setting</Text>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} /> 
           </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
            <Ionicons name="log-out-outline" size={24} color={COLORS.primary} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
      
    </ScrollView>
  );
};
//----------------------------------------------
const MessageScreen = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    // Fetch messages from MongoDB on component mount
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('link api');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete message from MongoDB
      await axios.delete(`${MONGODB_URL}/messages/${id}`);

      // Update state to reflect the deletion
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const renderMessages = () => {
    const filteredMessages = messages.filter((message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredMessages.map((message) => (
      <View key={message.id} style={styles.messageContainer}>
        <Image source={message.image} style={styles.avatar} />
        <Text>{message.name}</Text>
        <ScrollView horizontal>
          <Text>{message.content}</Text>
        </ScrollView>
        <TouchableOpacity onPress={() => handleDelete(message.id)}>
          <DeleteIcon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.containers}>
      <View style={styles.searchContainer}>
        <SearchIcon name="search" size={25} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity onPress={() => addFriend()}>
          <Icon name="person-add" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {renderMessages()}
        {/* Add a component for sending new messages */}
      </ScrollView>
    </View>
  );
};

//----------------------------------------------
const ThongBaoScreen = () => (
  <View style={styles.container}>
    <Text>Trang Thông Báo</Text>
    {/* Add your notification screen components here */}
  </View>
);
//----------------------------------------------
const images=[
  'https://tse3.mm.bing.net/th?id=OIP.-XNze6LxuIH9AXMTCTrRHQHaEy&pid=Api&P=0&h=180',
  'https://tse4.mm.bing.net/th?id=OIP.w4CXcspDoOi8H9fOZOpVTgHaFc&pid=Api&P=0&h=180',
  'https://tse2.mm.bing.net/th?id=OIP._57VIqjzqMB-sHtlSZJdQwHaFj&pid=Api&P=0&h=180',
]
const WIDTH=Dimensions.get('window').width;
const HEIGHT=Dimensions.get('window').height;

// Đặt tên cho icon sản phẩm và giỏ hàng
const productIconName = 'shopping-bag';
const cartIconName = 'shopping-cart';

const {width} = Dimensions.get('screen');

const categoryIcons = [
  { icon: <Icon name="compare-arrows" size={25} color={COLORS.primary}  />, text: 'Request' },
  { icon: <Icons name={productIconName} size={25} color={COLORS.primary} />, text: 'Sản phẩm' },
  { icon: <Icons name={cartIconName} size={25} color={COLORS.primary} />, text: 'Giỏ hàng' },
  { icon: <Icon name="star" size={25} color={COLORS.primary} />, text: 'Staff' },
];
const ListCategories = () => {  
  const navigation = useNavigation();

  const productIconName = 'shopping-bag'; // Tên của biểu tượng sản phẩm
  const cartIconName = 'shopping-cart'; // Tên của biểu tượng giỏ hàng

  const handleCategoryPress = (text) => {
    if (text === 'Request') {
      navigation.navigate('RequestScreen'); // Thay 'RequestScreen' thành tên màn hình thực tế của bạn
    }
    if (text === 'Product') {
      navigation.navigate('ProductScreen'); // Thay 'ProductScreen' thành tên màn hình thực tế của bạn
    }
    if (text === 'Cart') {
      navigation.navigate('CartScreen'); // Thay 'ProductScreen' thành tên màn hình thực tế của bạn
    }
    // Xử lý điều hướng cho các danh mục khác nếu cần
  };

  const categoryIcons = [
    { icon: <Icon name="compare-arrows" size={25} color={COLORS.primary} onPress={() => handleCategoryPress('Request')} />, text: 'Request' },
    { icon: <Icons name={productIconName} size={25} color={COLORS.primary} onPress={() => handleCategoryPress('Product')} />, text: 'Product' },
    { icon: <Icons name={cartIconName} size={25} color={COLORS.primary} />, text: 'Cart' },
    { icon: <Icon name="star" size={25} color={COLORS.primary} />, text: 'Staff' },
  ];

  return (
    <SafeAreaView style={styles.categoryContainer}>
      {categoryIcons.map((item, index) => (
        <TouchableOpacity key={index} 
        style={styles.iconContainer}
        onPress={() => handleCategoryPress(item.text)}>
          {item.icon}
          <Text style={styles.iconText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const Card = ({hot}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}>
      <ImageBackground style={styles.cardImage} source={hot.image}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          {hot.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="place" size={20} color={COLORS.white} />
            <Text style={{marginLeft: 5, color: COLORS.red}}>
              {hot.location}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon name="star" size={20} color={COLORS.yellow} />
            <Text style={{marginLeft: 5, color: COLORS.white}}>5.0</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const InforFlatList=()=>{
  return(
    <SafeAreaView>
      <Text style={styles.sectionTitle}>Informations</Text>
      <View>
      <FlatList
            contentContainerStyle={{paddingLeft: 10}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={Hot}
            renderItem={({item}) => <Card hot={item} />}
          />
      </View>
    </SafeAreaView>

  );
};

const NewsFlatList=()=>{
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate startIndex and endIndex based on currentPage
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [products, setProducts] = useState([]);
  const currentProducts = products.slice(startIndex, endIndex);
  // Calculate total pages based on the length of the products array
  const totalPages = Math.ceil(products.length / itemsPerPage);
  // Lọc danh sách tin tức dựa trên trang hiện tại
  const currentNews = Hot.slice(startIndex, endIndex);

  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    // Function to fetch API data
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrlProduct);
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchData();

    // Lưu ý: Bạn cũng có thể truyền mảng rỗng vào useEffect để chỉ chạy một lần duy nhất khi component được tạo ra
  }, []);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  
  return(
  <SafeAreaView style={styles.containera}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>New</Text>
      <TouchableOpacity style={styles.touchableOpacitys}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product, index) => (
          <TouchableOpacity key={index} style={styles.touchableOpacity}>
            <View style={styles.cardContainer}>
              <Image source={{ uri: product.images[0] }} style={styles.cardImages} />
              <Text style={styles.cardText}>{product.productName}</Text>
              
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage}>
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{`Page ${currentPage} of ${totalPages}`}</Text>
        <TouchableOpacity onPress={handleNextPage}>
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
      
  </SafeAreaView>
  );
};
const HomeScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView>
    <Swiper style={styles.wrapper} autoplay={true} paginationStyle={styles.pagination}>
        {images.map((image, index) => (
          <View style={styles.slide} key={index}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </Swiper>
      <View style={styles.test}> 
        <ListCategories />
        <InforFlatList/>
        <NewsFlatList/>
      </View>
    </ScrollView>
  </SafeAreaView>
  
);
//------------------------------------------------------------------------------
const HomePage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Information') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Message') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'ThongBao') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="ThongBao" component={ThongBaoScreen} />
      <Tab.Screen name="Information" component={InformationScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white', // Background color for pagination controls
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Text color for pagination controls
  },
  containers:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
   messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  backgroundImage:{
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  touchableOpacitys:{
    backgroundColor: 'transparent', // Đặt màu nền là transparent để có t hể thấy đường viền
    borderRadius: 25,
    borderWidth: 1, // Độ dày của đường viền
    borderColor: 'red', // Màu sắc của đường viền
  },
  section:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16
  },
  seeAllText:{
    marginHorizontal: 20,
    marginVertical: 20,
    fontSize: 13,
    color: 'red', // Màu chữ nút See All
    fontWeight: 'bold',
  },
  touchableOpacity:{
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardText:{
    flex: 1,
    fontSize: 18,
    color: '#333333',
  },
  cardImages:{
    width: 190,
    height: 90,
    borderRadius: 10,
    marginRight: 16,
  },
  cardContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollViewContent:{
    flexGrow: 1,
    paddingBottom: 20,
  },
  containera:{
    flex: 1,
    backgroundColor: '#ffffff', // Set your background color
    paddingHorizontal: 16,
    paddingTop: 20,
    
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '30%',
  },
  pagination: {
    bottom: 550, // Adjust the position of the dots as per your requirement
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginTop: 10,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
   
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  iconContainer: {
    height: 70,
    width: 70,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
  },
  sectionTitle: {
    marginHorizontal: 30,
    marginVertical: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333333',
  },
  cardImage: {
    height: 150,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 20,
  },
  test:{
    flex:1,
    bottom:500
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  iconcontainer:{
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  buttonIcon: {
    marginLeft: 10,
   
  },
  a:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box:{
    borderRadius: 20,
    borderWidth: 2,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginVertical: 5,
  },
  subtitle1:{
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Light',
  },
  userProfileContainer:{
    marginTop: -50,
    alignItems: 'center',
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  userBtn: {
    flexDirection: 'row',
    backgroundColor: '#E6DDE5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    margin:10,
  },
  btnText: {
    marginLeft: 10,
    color: '#DC6DCD',
    fontSize: 15,
  },
  a:{
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 10,
    paddingTop:20
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:20,
  },
  iconWrapper: {
    marginRight: 20, 
  },
  icons:{
    position: 'relative'
  },
  iconss:{
    marginRight: 10, 
    marginTop:5,
  },
  icon: {
    marginRight: 10, 
    marginTop:-30
  },
  containernew: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    flex: 1,
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  searchInput: {
    flex: 2,
    marginLeft: 10,
    paddingLeft:20,
    borderRadius: 20,
    backgroundColor: 'white',
    margin:5
  },
  addFriendIcon: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HomePage;
