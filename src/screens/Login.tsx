import { View, Text, StyleSheet, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Image, StatusBar, Alert } from "react-native";
import React, { useState } from "react";
import CustomInput from "components/CustomInput";
import CustomButton from "components/CustomButton";
import { logData } from "interface/interface";
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons"
import Zocial from "react-native-vector-icons/Zocial"
import useAuthStore from "zustand/authStore";

type LoginNavigationProp = NavigationProp<{ Register: undefined }>

export default function Login() {

  const navigation = useNavigation<LoginNavigationProp>();
  const isDarkMode: boolean = useColorScheme() === "dark";
  const [user, setUser] = useState<logData>({});
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  function handleLogin() {
    const { email, password } = user;

    if (!emailRegex.test(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address (e.g. user@example.com)."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Password Required",
        "Please enter your password to continue."
      );
      return;
    }


    useAuthStore.getState().login(user);
    setIsPasswordShow(false);
    setUser({ email: "", password: "" });
  }


  return (

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.mainContainer, { backgroundColor: isDarkMode ? "#124245" : "#f1eae2" }]}>
      <StatusBar backgroundColor={isDarkMode ? "#124245" : "#f1eae2"} barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <Image style={{ width: 200, height: 200 }} resizeMode="contain" source={isDarkMode
        ? require("../components/images/qwikly-full-logo-light.png")
        : require("../components/images/qwikly-full-logo.png")} />

      <Text style={[styles.Header, { color: isDarkMode ? "#f1eae2" : "#124245" }]} >Login</Text>



      <CustomInput onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))} value={user?.email || ""} returnKeyLabel="Go" keyboardType="email-address" placeholder="Enter Your Email" spellCheck={true} placeholderTextColor={isDarkMode ? "#124245" : "#f1eae2"} inputMode="email" />

      <View style={styles.inputWrapper}>
        <CustomInput onChangeText={(text) => setUser((prev) => ({ ...prev, password: text }))} value={user?.password} secureTextEntry={!isPasswordShow} placeholder="Enter Your Password" spellCheck={true} placeholderTextColor={isDarkMode ? "#124245" : "#f1eae2"} inputMode="text" />

        <Pressable onPress={() => setIsPasswordShow((prev) => !prev)} style={styles.eyeBtn}>

          <Ionicons name={isPasswordShow ? "eye-off" : "eye"} color={isDarkMode ? "#124245" : "#f1eae2"} size={25} />

        </Pressable>
      </View>

      <CustomButton onPress={handleLogin} title="Login" />

      <Pressable onPress={() => navigation.navigate("Register")}>

        <Text style={[styles.CTA, { color: isDarkMode ? "#f1eae2" : "#124245" }]}>New to Qwikly?Create an account</Text>

      </Pressable>


      <View style={styles.socialAction}>

        <Pressable style={({ pressed }) => [styles.socialActionBtn, { backgroundColor: isDarkMode ? pressed ? "#f47679" : "#f1eae2" : pressed ? "#f47679" : "#124245" }]}>

          {({ pressed }) => <Ionicons size={25} color={isDarkMode ? pressed ? "#f1eae2" : "#124245" : "#f1eae2"} name={"logo-google"} />}

        </Pressable>

        <Pressable style={({ pressed }) => [styles.socialActionBtn, { backgroundColor: isDarkMode ? pressed ? "#f47679" : "#f1eae2" : pressed ? "#f47679" : "#124245" }]}>

          {({ pressed }) => <Zocial size={25} color={isDarkMode ? pressed ? "#f1eae2" : "#124245" : "#f1eae2"} name={"facebook"} />}

        </Pressable>
      </View>


    </KeyboardAvoidingView>

  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: -50,
  },
  Header: {
    fontSize: 30,
    fontWeight: 600,
    marginBottom: 10,
    fontFamily: "Fredoka-Bold",
  },
  CTA: {
    fontSize: 20,
    fontFamily: "Fredoka-Regular"
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  eyeBtn: {
    position: "absolute",
    right: 15,
    top: "10%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  socialAction: {
    flexDirection: "row",
    marginTop: 50,
    justifyContent: "space-around",
    width: "100%"
  },
  socialActionBtn: {
    width: 150,
    justifyContent: "center",
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  }
})
