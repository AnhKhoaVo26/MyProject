import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons từ Expo Vector Icons

const ResetPasswordScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false); // State cho oldPassword
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false); // State cho newPassword

  // Animated fall effect
  const snowflakes = Array(30).fill().map(() => new Animated.Value(0));

  const toggleOldPasswordVisibility = () => {
    setIsOldPasswordVisible(!isOldPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const handleResetPassword = async () => {
    try {
      if (!email || !password || !newPassword) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      }

      setLoading(true);

      const response = await axios.put('http://10.8.18.20:8000/CIS/user/update-password-by-email', {
        email,
        password,
        newPassword,
      });

      setLoading(false);

      if (response.data.message === 'User updated successfully!') {
        Alert.alert('Success', 'Password reset successful.', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreens') },
        ]);
      } else {
        Alert.alert('Error', 'Password reset failed. Please check your old password and try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while resetting the password.');
    }
  };

  // Start snowfall animation
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

  useEffect(() => {
    startSnowfall();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title Reset Password with blue color */}
        <Text style={styles.title}>Reset Password</Text>
        
        <TextInput
          placeholder="Enter Your Email"
          placeholderTextColor="#4F4A4F"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        
        {/* Old Password Field with Eye Icon */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Old Password"
            placeholderTextColor="#4F4A4F"
            secureTextEntry={!isOldPasswordVisible}
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={toggleOldPasswordVisibility} style={styles.eyeIcon}>
            <Ionicons name={isOldPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#4F4A4F" />
          </TouchableOpacity>
        </View>
        
        {/* New Password Field with Eye Icon */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#4F4A4F"
            secureTextEntry={!isNewPasswordVisible}
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TouchableOpacity onPress={toggleNewPasswordVisibility} style={styles.eyeIcon}>
            <Ionicons name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#4F4A4F" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC6DCD', 
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    fontSize: 18,
    padding: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    width: '90%',
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  button: {
    padding: 15,
    backgroundColor: '#DC6DCD', 
    borderRadius: 25,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  snowfallContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // To keep the snowflakes behind the main content
  },
  snowflake: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 10,
    height: 10,
    opacity: 0.8,
  },
});

export default ResetPasswordScreen;
