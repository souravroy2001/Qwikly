import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import useAuthStore from 'zustand/authStore';

export default function OrderSuccess() {
  const { isDarkMode } = useAuthStore()
  return (
    <View>
      <StatusBar backgroundColor={isDarkMode === "dark" ? "#124245" : "#f1eae2"} barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"} />
      <Text>OrderSuccess</Text>
    </View>
  );
}
