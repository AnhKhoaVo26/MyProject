import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  ImageBackground, 
  StyleSheet, 
  Animated 
} from 'react-native';
import Btn from '../other/Btn';
import { darktim, tim } from '../other/Constant';

const { height, width } = Dimensions.get('window');

const HomeScreens = (props) => {
  const snowflakes = Array.from({ length: 50 }, () => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * -height), // Khởi tạo ngoài màn hình trên
    size: Math.random() * 10 + 5, // Kích thước tuyết
    speed: Math.random() * 3000 + 2000, // Tốc độ rơi
  }));

  useEffect(() => {
    snowflakes.forEach(({ y, speed }) => {
      Animated.loop(
        Animated.timing(y, {
          toValue: height + 10, // Rơi hết màn hình dưới
          duration: speed,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Hiệu ứng tuyết rơi */}
      {snowflakes.map((snowflake, index) => (
        <Animated.View
          key={index}
          style={[
            styles.snowflake,
            {
              width: snowflake.size,
              height: snowflake.size,
              backgroundColor: 'white',
              opacity: 0.8,
              borderRadius: snowflake.size / 2,
              position: 'absolute',
              transform: [
                { translateX: snowflake.x },
                { translateY: snowflake.y },
              ],
            },
          ]}
        />
      ))}

      {/* Hình nền logo */}
      <ImageBackground 
        source={require('../images/logocis.png')} 
        style={styles.imageBackground}
        imageStyle={styles.imageBackgroundStyle}
      />

      {/* Các văn bản (text) dưới hình nền */}
      <View style={styles.textOverlay}>
        <Text style={styles.title}>Information Technology Service Center</Text>
        <Text style={styles.subtitle}>Hợp Tác - Phát Triển - Bền Vững</Text>
      </View>

      {/* Các nút Login và SignUp */}
      <View style={styles.buttonContainer}>
        <Btn
          bgColor={tim}
          textColor={'white'}
          btnLabel="LOGIN"
          Press={() => props.navigation.navigate('LoginScreens')}
        />
        <Btn
          bgColor={darktim}
          textColor={'white'}
          btnLabel="SIGNUP"
          Press={() => props.navigation.navigate('SignUpScreens')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageBackground: {
    margin: 10,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  imageBackgroundStyle: {
    opacity: 0.7, // Thêm hiệu ứng mờ cho hình nền
  },
  textOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20, // Khoảng cách giữa hình nền và văn bản
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#AA4F9E',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
    marginHorizontal: 20,
  },
  snowflake: {
    position: 'absolute',
  },
});

export default HomeScreens;
