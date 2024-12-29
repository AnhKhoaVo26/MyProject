import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { apiUrlRequest } from '../other/apiCofig';

const RequestScreen = () => {
  const initialState = {
    request: {
      name: '',
      email: '',
      telephone: '',
      location: '',
      yourRequest: '',
      selectedTopic: '',
    },
    isModalVisible: false,
  };

  const options = ['Internet/Wifi', 'BlackBoard', 'Email/MS Office', 'Device', 'Zoom', 'Khác'];

  const [state, setState] = useState(initialState);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showMessage, setShowMessage] = useState(null);

  const showMessageWithTimeout = (message, type) => {
    setShowMessage({ message, type });
    setTimeout(() => {
      setShowMessage(null);
    }, 3000);
  };

  const handleChange = (key, value) => {
    if (key === 'selectedTopic') {
      setSelectedTopic(value);
    } else {
      setState({
        ...state,
        request: { ...state.request, [key]: value },
      });
    }
  };

  const sendRequestToAPI = async () => {
    try {
      // Add 'selectedTopic' to the request object
      const requestData = {
        ...state.request,
        selectedTopic,
      };

      const response = await axios.post(apiUrlRequest, requestData);
      console.log('API Response:', response.data);
      showMessageWithTimeout('Request successful!', 'success');
      setState(initialState);
    } catch (error) {
      console.error('API Request Error:', error);
    }
  };

  const handleRequestSubmit = () => {
    console.log('Yêu cầu đã được nộp:', state.request.yourRequest);
    sendRequestToAPI();
  };

  const toggleModal = () => {
    setState({ ...state, isModalVisible: !state.isModalVisible });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>We Are Ready To Hear Your Opinion</Text>
      <Text style={styles.titleAfter}>What Is Your Request</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Họ tên của bạn (Họ tên + MSSV nếu bạn là sinh viên)"
          onChangeText={(text) => handleChange('name', text)}
          value={state.request.name}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email của bạn"
          onChangeText={(text) => handleChange('email', text)}
          value={state.request.email}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="call" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          onChangeText={(text) => handleChange('telephone', text)}
          value={state.request.telephone}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="home" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Bạn ở phòng nào"
          onChangeText={(text) => handleChange('location', text)}
          value={state.request.location}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="document-text" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Yêu cầu của bạn"
          onChangeText={(text) => handleChange('yourRequest', text)}
          value={state.request.yourRequest}
          multiline={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>
          {selectedTopic ? `Selected Topic: ${selectedTopic}` : 'Select A Required Topic'}
        </Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={state.isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose A Request</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    selectedTopic === item && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedTopic(item);
                    toggleModal();
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.submitButton} onPress={handleRequestSubmit}>
        <Text style={styles.buttonText}>Sending...</Text>
      </TouchableOpacity>
      {showMessage && (
        <View style={{ backgroundColor: showMessage.type === 'success' ? 'green' : 'red', padding: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>{showMessage.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 40,
  },
  titleAfter: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#a3a3c2',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#DC6DCD',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
});

export default RequestScreen;
