import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from 'zustand/authStore';

const Account = () => {
  const { isDarkMode, user } = useAuthStore();
  const [phone, setPhone] = useState('');

  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
    color: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
    borderColor: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
  };

  const handleChange = () => {
    console.log("Value changed");
  };

  const handleEditPhoto = () => {
    Alert.alert("Edit Photo", "Add logic here to pick image from gallery.");
  };

  const handleSave = () => {
    Alert.alert("Saved", "Your changes have been saved.");
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.photoURL
              || 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={styles.profileImage}
        />
        <Pressable style={[styles.editIcon, { backgroundColor: themeStyles.color }]} onPress={handleEditPhoto}>
          <Ionicons name="camera-reverse-sharp" size={18} color={themeStyles.backgroundColor} />
        </Pressable>
      </View>

      <Text style={[styles.header, { color: themeStyles.color }]}>Edit Profile</Text>

      <Text style={[styles.label, { color: themeStyles.color }]}>Full Name</Text>
      <TextInput
        style={[styles.input, { color: themeStyles.color, borderColor: themeStyles.borderColor }]}
        value={user?.name}
        onChangeText={handleChange}
        placeholder="Your full name"
        placeholderTextColor={themeStyles.color + '80'}
      />

      <Text style={[styles.label, { color: themeStyles.color }]}>User Name</Text>
      <TextInput
        style={[styles.input, { color: themeStyles.color, borderColor: themeStyles.borderColor }]}
        value={user?.userName}
        onChangeText={handleChange}
        editable={false}
      />

      <Text style={[styles.label, { color: themeStyles.color }]}>Email</Text>
      <TextInput
        style={[styles.input, { color: themeStyles.color, borderColor: themeStyles.borderColor }]}
        value={user?.email}
        onChangeText={handleChange}
        placeholder="Email address"
        placeholderTextColor={themeStyles.color + '80'}
        keyboardType="email-address"
        editable={false}
      />

      <Text style={[styles.label, { color: themeStyles.color }]}>Phone</Text>
      <TextInput
        style={[styles.input, { color: themeStyles.color, borderColor: themeStyles.borderColor }]}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone number"
        placeholderTextColor={themeStyles.color + '80'}
        keyboardType="phone-pad"
      />

      <Pressable style={[styles.saveButton, { backgroundColor: themeStyles.color }]} onPress={handleSave}>
        <Ionicons name="checkmark-done-outline" size={20} color={themeStyles.backgroundColor} />
        <Text style={[styles.saveText, { color: themeStyles.backgroundColor }]}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    padding: 6,
    borderRadius: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    justifyContent: 'center',
  },
  saveText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Account;
