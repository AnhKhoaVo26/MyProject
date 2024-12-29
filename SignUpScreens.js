import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { apiUrl } from '../other/apiCofig';

const { width, height } = Dimensions.get('window');

const SignUpScreens = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [telephone, setPhoneNumber] = useState('');
  const [date, setBirthDay] = useState('');
  const [showMessage, setShowMessage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showMessageWithTimeout = (message, type) => {
    setShowMessage({ message, type });
    setTimeout(() => {
      setShowMessage(null);
    }, 3000);
  };

  const handleSignUp = () => {
    const data = {
      name,
      email,
      password,
      confirmpassword,
      telephone,
      date,
    };

    axios
      .post(`${apiUrl}/register`, data)
      .then(() => {
        showMessageWithTimeout('Registration successful!', 'success');
      })
      .catch(() => {
        showMessageWithTimeout('Registration failed. Please try again.', 'error');
      });
  };

  // Hiệu ứng tuyết rơi
  const snowflakes = Array.from({ length: 50 }, () => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * -height),
    size: Math.random() * 10 + 5,
    speed: Math.random() * 3000 + 2000,
  }));

  useEffect(() => {
    snowflakes.forEach(({ y, speed }) => {
      Animated.loop(
        Animated.timing(y, {
          toValue: height + 10,
          duration: speed,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create a new account</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Name"
              placeholderTextColor="#888"
              style={styles.input}
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity style={styles.iconWrapper} onPress={togglePasswordVisibility}>
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmpassword}
            />
            <TouchableOpacity style={styles.iconWrapper} onPress={togglePasswordVisibility}>
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#888"
              style={styles.input}
              onChangeText={(text) => setPhoneNumber(text)}
              value={telephone}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={24} color="#888" style={styles.icon} />
            <TextInput
              placeholder="Birth Day (dd/mm/yyyy)"
              placeholderTextColor="#888"
              style={styles.input}
              onChangeText={(text) => setBirthDay(text)}
              value={date}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {showMessage && (
          <View
            style={[
              styles.messageBox,
              { backgroundColor: showMessage.type === 'success' ? '#4CAF50' : '#F44336' },
            ]}
          >
            <Text style={styles.messageText}>{showMessage.message}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    padding: 30,
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#DC6DCD',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  input: {
    fontSize: 16,
    paddingVertical: 15,
    paddingLeft: 0,
    flex: 1,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#DC6DCD',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  messageBox: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  snowflake: {
    position: 'absolute',
  },
});

export default SignUpScreens;
