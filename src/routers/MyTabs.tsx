import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "screens/Home";
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons
    from "react-native-vector-icons/MaterialCommunityIcons"
import Profile from "screens/Profile";
import Messages from "screens/Messages";
import useThemeStore from "zustand/themeState";


const Tab = createBottomTabNavigator()

function MyTabs(): React.JSX.Element {
    const { isDarkMode } = useThemeStore()

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) => {
                if (route.name === "Home") {
                    return (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    )
                } else if (route.name === "Message") {
                    return (
                        <Ionicons name={focused ? "mail-sharp" : "mail-outline"} size={size} color={color} />
                    )
                } else if (route.name === "Profile") {
                    return (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={size} color={color} />
                    )
                }
            },
            tabBarActiveTintColor: isDarkMode === "dark" ? "#f47679" : "#124245",
            tabBarInactiveTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
            tabBarStyle: {
                backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
                height: 50,
            },
            tabBarLabelStyle: {
                fontSize: 12
            }
        })}>
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Message" component={Messages} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    )

}


export default MyTabs;
