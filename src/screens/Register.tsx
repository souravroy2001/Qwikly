import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, useColorScheme, Image, StatusBar, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { logData } from "interface/interface";
import CustomInput from "components/CustomInput";
import CustomButton from "components/CustomButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"
import Zocial from "react-native-vector-icons/Zocial"
import useAuthStore from "zustand/authStore";

type LoginNavigationProp = NavigationProp<{ Login: undefined }>

export default function Register() {
    const [user, setUser] = useState<logData>({});
    const navigation = useNavigation<LoginNavigationProp>();
    const isDarkMode: boolean = useColorScheme() === "dark";
    const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    function generateUsername(fullName: string): string {
        const prefix = "Qw";

        const randomNumbers = () => {
            return (
                Math.floor(Math.random() * 10).toString() +
                Math.floor(Math.random() * 10).toString()
            );
        };

        const nameParts = fullName.trim().split(" ");
        let shortName = nameParts[0].charAt(0).toLowerCase();
        if (nameParts[1]) {
            shortName += nameParts[1].slice(0, 2).toLowerCase();
        } else {
            shortName += nameParts[0].slice(1, 3).toLowerCase();
        }

        let base = `${prefix}${randomNumbers()}_${shortName}`;

        while (base.length < 10) {
            base += Math.floor(Math.random() * 10);
        }

        return base;
    }


    function handleRegister() {
        const { email, password, name } = user;

        if (!name || name.trim() === "") {
            Alert.alert("Missing Name", "Enter your name to continue.");
            return;
        }

        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address (e.g. user@example.com).");
            return;
        }

        if (!password) {
            Alert.alert("Password Required", "Please enter your password.");
            return;
        }

        if (password.length < 8) {
            Alert.alert("Weak Password", "Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            Alert.alert("Weak Password", "Password must include at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            Alert.alert("Weak Password", "Password must include at least one lowercase letter.");
            return;
        }

        if (!/[0-9]/.test(password)) {
            Alert.alert("Weak Password", "Password must include at least one number.");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            Alert.alert("Weak Password", "Password must include at least one special character.");
            return;
        }


        const userName = generateUsername(name)

        useAuthStore.getState().register({ email, password, name, userName });

        setUser({
            name: "",
            email: "",
            password: "",
        })

        setIsPasswordShow(false)
    }

    return (

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.mainContainer, { backgroundColor: isDarkMode ? "#124245" : "#f1eae2" }]}>
            <StatusBar backgroundColor={isDarkMode ? "#124245" : "#f1eae2"} barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <Image style={{ width: 200, height: 200 }} resizeMode="contain" source={isDarkMode
                ? require("../components/images/qwikly-full-logo-light.png")
                : require("../components/images/qwikly-full-logo.png")} />

            <Text style={[styles.Header, { color: isDarkMode ? "#f1eae2" : "#124245" }]}>Register</Text>

            <CustomInput onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))} value={user?.name || ""} placeholder="Enter Your Name" spellCheck={true} placeholderTextColor={isDarkMode ? "#124245" : "#f1eae2"} />

            <CustomInput onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))} value={user?.email} returnKeyLabel="Go" keyboardType="email-address" placeholder="Enter Your Email" spellCheck={true} placeholderTextColor={isDarkMode ? "#124245" : "#f1eae2"} />

            <View style={styles.inputWrapper}>
                <CustomInput onChangeText={(text) => setUser((prev) => ({ ...prev, password: text }))} value={user?.password} secureTextEntry={!isPasswordShow} placeholder="Enter Your Password" spellCheck={true} placeholderTextColor={isDarkMode ? "#124245" : "#f1eae2"} />

                <Pressable onPress={() => setIsPasswordShow((prev) => !prev)} style={styles.eyeBtn}>

                    <Ionicons name={isPasswordShow ? "eye-off" : "eye"} color={isDarkMode ? "#124245" : "#f1eae2"} size={25} />

                </Pressable>
            </View>

            <CustomButton onPress={() => handleRegister()} title="Register" />

            <Pressable onPress={() => navigation.navigate("Login")}> <Text style={[styles.CTA, { color: isDarkMode ? "#f1eae2" : "#124245" }]}>Already with us?Log In</Text> </Pressable>

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
        fontFamily: "Fredoka-Bold"
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
