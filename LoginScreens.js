import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { apiUrl, apiUrlCart } from '../other/apiCofig';

const Checkbox = ({ checked, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.checkboxContainer}
  >
    {checked && <View style={styles.checkboxChecked} />}
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [showMessage, setShowMessage] = useState(null);
  const [rememberAccount, setRememberAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // Animated snowfall effect
  const snowflakes = Array(30).fill().map(() => new Animated.Value(0));

  const showMessageWithTimeout = (message, type) => {
    setShowMessage({ message, type });
    setTimeout(() => {
      setShowMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const [storedEmail, storedRememberAccount] = await Promise.all([
          AsyncStorage.getItem('email'),
          AsyncStorage.getItem('rememberAccount'),
        ]);

        storedEmail && setEmail(storedEmail);
        storedRememberAccount && setRememberAccount(JSON.parse(storedRememberAccount));
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadDataFromStorage();

    startSnowfall(); // Start snowfall animation
  }, []);

  // Snowfall animation logic
  const startSnowfall = () => {
    snowflakes.forEach((snowflake) => {
      const randomX = Math.random() * 400; // Random horizontal position
      const duration = Math.random() * 5000 + 5000; // Random duration for snowfall

      // Loop the animation continuously
      Animated.loop(
        Animated.timing(snowflake, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        })
      ).start();

      snowflake.translateX = randomX; // Snowflakes move horizontally
      snowflake.translateY = 600; // Snowflakes move down to simulate falling

      snowflake.addListener(() => {
        if (snowflake._value >= 1) {
          snowflake.setValue(0); // Reset snowflake position when it reaches the end
        }
      });
    });
  };

  const handleLogin = async () => {
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[.!@#$%^&*]/.test(password)) {
      showMessageWithTimeout(
        'Password must have at least 8 characters with at least 1 uppercase character and 1 special character.',
        'error'
      );
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      showMessageWithTimeout('Login Successful!', 'success');
      navigation.navigate('HomePage', { userId: response.data.userId });

      AsyncStorage.setItem('userId', response.data.userId);

      if (rememberAccount) {
        AsyncStorage.setItem('email', email || '');
        AsyncStorage.setItem('rememberAccount', JSON.stringify(rememberAccount));
      }

      const selectedItemsJson = await AsyncStorage.getItem('selectedItems');
      if (selectedItemsJson) {
        const selectedItems = JSON.parse(selectedItemsJson);
        try {
          const userId = response.data.userId + Date.now();
          await axios.post(`${apiUrlCart}?userId=${userId}`, selectedItems);
          showMessageWithTimeout('Products added to cart!', 'success');
        } catch (error) {
          console.error('Error adding products to cart:', error);
        }
        await AsyncStorage.removeItem('selectedItems');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showMessageWithTimeout('Login failed. Please try again.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Login Here</Text>
          <Text style={styles.headerSubtitle}>Welcome To App</Text>
        </View>
        <View>
          <TextInput
            placeholder="Enter Your Email"
            placeholderTextColor="#4F4A4F"
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#4F4A4F"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.options}>
          <View style={styles.rememberAccountContainer}>
            <Checkbox checked={rememberAccount} onPress={() => setRememberAccount(!rememberAccount)} />
            <Text style={styles.rememberAccountText}>Remember Account</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showMessage && (
        <View
          style={[styles.messageContainer, { backgroundColor: showMessage.type === 'success' ? 'green' : 'red' }]}
        >
          <Text style={styles.messageText}>{showMessage.message}</Text>
        </View>
      )}

      {/* Snowfall Effect */}
      <View style={styles.snowfallContainer}>
        {snowflakes.map((snowflake, index) => (
          <Animated.View
            key={index}
            style={[
              styles.snowflake,
              {
                transform: [
                  {
                    translateY: snowflake.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 600], // Snowfall goes down to 600
                    }),
                  },
                  {
                    translateX: snowflake.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Math.random() * 400, Math.random() * 400],
                    }),
                  },
                ],
                opacity: snowflake.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 1],
                }),
              },
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 40,
    color: '#DC6DCD',
  },
  headerSubtitle: {
    fontSize: 30,
    marginVertical: 20,
  },
  input: {
    fontSize: 20,
    padding: 15,
    backgroundColor: '#E6DEE6',
    borderRadius: 40,
    marginVertical: 10,
    margin: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  rememberAccountText: {
    marginLeft: 5,
  },
  forgotPasswordText: {
    fontSize: 17,
    margin: 10,
    color: '#312F31',
  },
  buttonContainer: {
    marginTop: 20,
    width: '95%',
    paddingLeft: 10,
    margin: 5,
  },
  loginButton: {
    padding: 20,
    backgroundColor: '#DC6DCD',
    borderRadius: 30,
  },
  loginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  messageContainer: {
    padding: 10,
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
  },
  snowfallContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  snowflake: {
    position: 'absolute',
    top: -10,
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    opacity: 0.5,
  },
});

export default LoginScreen;
