import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react';
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Entypo from "react-native-vector-icons/Entypo"
import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import useAuthStore from 'zustand/authStore';
import { navigate } from './NavigationService';
import { Screen } from 'react-native-screens';

type CustomHeaderTitlePrams = {
    Home: undefined;
}

function CustomHeaderTitle(): React.JSX.Element {
    const { isDarkMode } = useAuthStore()
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
    const { isDarkMode, cartItems, favorites, } = useAuthStore()
    const navigation = useNavigation<StackNavigationProp<CustomHeaderRightParamList>>()

    const themeStyles = {
        color: isDarkMode === "dark" ? "#f1eae2" : "#124245",
        backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
    };

    const cartItemCount = cartItems.length;
    const favoriteItemCount = favorites.length;

    return (
        <View style={{ flexDirection: "row", padding: 10, gap: 20 }}>

            <Pressable hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }} onPress={() => navigate("Search")}> <Ionicons name={"search"} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} size={25} /> </Pressable>

            <Pressable
                hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }}
                onPress={() => navigate("Cart")}
            >
                <View style={styles.iconWrapper}>
                    <Ionicons
                        name="cart-outline"
                        color={themeStyles.color}
                        size={25}
                    />
                    {cartItemCount > 0 && (
                        <View style={[styles.badge, { backgroundColor: themeStyles.color }]}>
                            <Text style={[styles.badgeText, { color: themeStyles.backgroundColor }]}>{cartItemCount}</Text>
                        </View>
                    )}
                </View>
            </Pressable>

            <Pressable
                hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }}
                onPress={() => navigate("Favorites")}
            >
                <View style={styles.iconWrapper}>
                    <Entypo
                        name="heart-outlined"
                        color={themeStyles.color}
                        size={25}
                    />
                    {favoriteItemCount > 0 && (
                        <View style={[styles.badge, { backgroundColor: themeStyles.color }]}>
                            <Text style={[styles.badgeText, { color: themeStyles.backgroundColor }]}>{favoriteItemCount}</Text>
                        </View>
                    )}
                </View>
            </Pressable>

            <Pressable hitSlop={{ top: 30, right: 30, left: 10, bottom: 30 }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> <FontAwesome6 name={"bars-staggered"} size={25} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} /> </Pressable>

        </View>
    )
}


const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 20,
    },
    iconWrapper: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 10,
        width: 17,
        height: 17,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center"
    },
})

const CustomHeader = {
    headerLeft: () => null,
    headerTitle: () => <CustomHeaderTitle />,
    headerTitleStyle: { fontSize: 20 },
    headerRight: () => <CustomHeaderRight />,
};

export default CustomHeader;
