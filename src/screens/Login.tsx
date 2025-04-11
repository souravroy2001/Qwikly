import { View, Text, Pressable, useColorScheme } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import useThemeStore from 'zustand/themeState';

type LoginNavigationProp = NavigationProp<{ Register: undefined }>;

export default function Login() {

  const navigation = useNavigation<LoginNavigationProp>();
  const isDarkMode = useColorScheme() === "dark";
  

  return (
    <View>
      <Text>Login</Text>
      <Pressable onPress={() => navigation.navigate("Register")}><Text>Go To Register </Text></Pressable>
    </View>
  )
}
