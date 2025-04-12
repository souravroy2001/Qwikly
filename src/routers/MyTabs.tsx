import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "screens/Home";
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons
    from "react-native-vector-icons/MaterialCommunityIcons"
import useAuthStore from "zustand/authStore";
import Shop from "screens/Shop";
import Categories from "screens/Categories";
import Account from "screens/Account";


const Tab = createBottomTabNavigator()

function MyTabs(): React.JSX.Element {
    const { isDarkMode } = useAuthStore()

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) => {
                if (route.name === 'Home') {
                    return (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Account') {
                    return (
                        <MaterialCommunityIcons
                            name={focused ? 'account' : 'account-outline'}
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Shop') {
                    return (
                        <Ionicons
                            name={focused ? 'cart' : 'cart-outline'}
                            size={size}
                            color={color}
                        />
                    );
                } else if (route.name === 'Categories') {
                    return <MaterialIcons name={'category'} size={size} color={color} />;
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

            <Tab.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Shop"
                component={Shop}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Categories"
                component={Categories}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    )

}


export default MyTabs;
