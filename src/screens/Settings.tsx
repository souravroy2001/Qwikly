import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigate } from 'routers/NavigationService';
import useAuthStore from 'zustand/authStore'; // your zustand store

const Settings = () => {
  const { isDarkMode, toggleTheme, logout } = useAuthStore();
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const themeStyles = {
    color: isDarkMode === "dark" ? "#f1eae2" : "#124245",
    backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
  };

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: () => logout()
      }
    ]);
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: themeStyles.backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: themeStyles.color }]}>Account</Text>

        <Pressable style={styles.item} onPress={() => navigate("Account")}>
          <Ionicons name="person-outline" size={22} color={themeStyles.color} />
          <Text style={[styles.itemText, { color: themeStyles.color }]}>Edit Profile</Text>
        </Pressable>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: themeStyles.color }]}>Preferences</Text>

        <View style={styles.item}>
          <Ionicons name={isDarkMode === "dark" ? "moon-outline" : "sunny-outline"} size={22} color={themeStyles.color} />
          <Text style={[styles.itemText, { color: themeStyles.color }]}>{isDarkMode} Mode</Text>
          <Switch
            value={isDarkMode === "dark"}
            onValueChange={() => toggleTheme()}
            thumbColor={isDarkMode ? "#f1eae2" : "#124245"}
          />
        </View>

        <View style={styles.item}>
          <Ionicons name="notifications-outline" size={22} color={themeStyles.color} />
          <Text style={[styles.itemText, { color: themeStyles.color }]}>Notifications</Text>
          <Switch
            value={isNotificationsOn}
            onValueChange={() => setIsNotificationsOn(!isNotificationsOn)}
            thumbColor={isDarkMode ? "#f1eae2" : "#124245"}
          />
        </View>

        <View style={styles.item}>
          <Ionicons name="language-outline" size={22} color={themeStyles.color} />
          <Text style={[styles.itemText, { color: themeStyles.color }]}>Language</Text>
          <Text style={[styles.languageValue, { color: themeStyles.color }]}>
            {selectedLanguage}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: themeStyles.color }]}>App</Text>

        <View style={styles.item}>
          <Ionicons name="information-circle-outline" size={22} color={themeStyles.color} />
          <Text style={[styles.itemText, { color: themeStyles.color }]}>Version</Text>
          <Text style={[styles.languageValue, { color: themeStyles.color }]}>1.0.0</Text>
        </View>
      </ScrollView>

      <Pressable style={[styles.logoutButton, { backgroundColor: themeStyles.color }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={themeStyles.backgroundColor} />
        <Text style={[styles.logoutText, { color: themeStyles.backgroundColor }]}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    textTransform: "capitalize"
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 15,
    margin: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings;
