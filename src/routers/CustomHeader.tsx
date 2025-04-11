import { View, Text, Image, Pressable } from 'react-native'
import React from 'react';
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { DrawerActions, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import useThemeStore from 'zustand/themeState';

type CustomHeaderTitlePrams = {
    Home: undefined;
}

function CustomHeaderTitle(): React.JSX.Element {
    const { isDarkMode } = useThemeStore()
    const navigation = useNavigation<StackNavigationProp<CustomHeaderTitlePrams>>()

    const logoImage = isDarkMode === "dark"
        ? require("../components/images/qwikly-logo-light.png")
        : require("../components/images/qwikly-logo.png");

    return (
        <View style={{ justifyContent: "center", alignItems: "flex-start", marginLeft: -30 }}>
            <Pressable onPress={() => navigation.navigate("Home")}>
                <Image source={logoImage} style={{ width: 150, height: 40, resizeMode: 'contain' }} />
            </Pressable>
        </View>
    )
}

type CustomHeaderRightParamList = {
    Search: undefined;
    Notifications: undefined;
};

function CustomHeaderRight(): React.JSX.Element {
    const { isDarkMode, toggleTheme } = useThemeStore()
    const navigation = useNavigation<StackNavigationProp<CustomHeaderRightParamList>>()
    return (
        <View style={{ flexDirection: "row", padding: 10, gap: 20 }}>

            <Pressable hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }} onPress={() => navigation.navigate("Search")}> <Ionicons name={"search"} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} size={25} /> </Pressable>

            <Pressable hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }} onPress={() => navigation.navigate("Notifications")} > <FontAwesome name={"bell-o"} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} size={25} /> </Pressable>

            <Pressable hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }} onPress={() => toggleTheme()}> <Ionicons name={isDarkMode === "dark" ? "moon-outline" : "sunny-outline"} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} size={25} /> </Pressable>

            <Pressable hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> <FontAwesome6 name={"bars-staggered"} size={25} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} /> </Pressable>

        </View>
    )
}


const CustomHeader = {
    headerLeft: () => null,
    headerTitle: () => <CustomHeaderTitle />,
    headerTitleStyle: { fontSize: 20 },
    headerRight: () => <CustomHeaderRight />,
};

export default CustomHeader;
