import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import useAuthStore from "zustand/authStore";
import { closeDrawer } from "./NavigationService";

function CustomDrawerContent(props: DrawerContentComponentProps): React.JSX.Element {
    const [showOverlay, setShowOverlay] = useState(false);
    const { user, isDarkMode } = useAuthStore()

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2", flex: 1 }}>
            <View style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: "absolute",
                right: 10,
                top: 10,
                zIndex: 1
            }}>

                <Pressable hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }} onPress={() => closeDrawer()}>
                    <Ionicons name="close" size={24} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} />
                </Pressable>
            </View>

            <View style={styles.profileSection}>
                <Pressable onPress={() => setShowOverlay((prev) => !prev)}>
                    <Image source={{
                        uri: user?.photoURL
                            || 'https://www.w3schools.com/w3images/avatar2.png',
                    }} style={[styles.profileImage, { backgroundColor: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]} />

                    {
                        showOverlay && (
                            <View style={[styles.profileOverlay, { backgroundColor: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>
                                <Ionicons name="camera-reverse-sharp" color={isDarkMode === "dark" ? "#124245" : "#f1eae2"} size={30} />
                            </View>
                        )
                    }


                </Pressable>
                <View>
                    <Text style={[styles.profileFullName, { color: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}> {user?.name} </Text>
                    <Text style={[styles.profileUSerName, { color: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>{user?.userName}</Text>
                </View>
            </View>
            <View style={styles.drawerItems}>
                <DrawerItemList {...props} />
            </View>

            <View style={[styles.footer, { borderColor: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>
                <Pressable style={styles.logoutBtn} onPress={() => useAuthStore.getState().logout()}>
                    <Ionicons name={"exit-outline"} size={25} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} />
                    <Text style={[styles.logout, { color: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>Logout</Text>
                </Pressable>
            </View>

        </DrawerContentScrollView>
    )
}


const styles = StyleSheet.create({
    profileSection: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 20,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 1,
    },
    profileOverlay: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.8
    },
    profileFullName: {
        fontSize: 30,
        fontWeight: 600,
    },
    profileUSerName: {
        fontSize: 20,
        fontWeight: 500,
        marginLeft: 7,
    },
    drawerItems: {
        flex: 1,
        paddingTop: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    logout: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: "center",
    },
    logoutBtn: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
})

export default CustomDrawerContent;
