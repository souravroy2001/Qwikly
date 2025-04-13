import { createDrawerNavigator } from '@react-navigation/drawer';
import MyStack from './MyStack';
import Profile from 'screens/Account';
import CustomDrawerContent from './CustomDrawerContent';
import Settings from 'screens/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from './CustomHeader';
import useAuthStore from 'zustand/authStore';
import Account from 'screens/Account';
import Notifications from 'screens/Notifications';
import Orders from 'screens/Orders';


const Drawer = createDrawerNavigator();

function MyDrawer() {
    const { isDarkMode } = useAuthStore()
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{
            drawerActiveBackgroundColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
            drawerActiveTintColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
            drawerInactiveTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
            drawerLabelStyle: {
                fontSize: 16,
                marginLeft: -10,
                fontWeight: '600',
                paddingHorizontal: 10
            },
            drawerItemStyle: {
                marginTop: 10,
                borderRadius: 10,
            }
        }}>
            <Drawer.Screen name="Home" component={MyStack} options={{
                headerShown: false,
                drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
                )
            }} />
            <Drawer.Screen name="Account" component={Account}
                options={{
                    ...CustomHeader,
                    drawerIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={size} color={color} />
                    ),
                    headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" }
                }} />
            <Drawer.Screen name="Notifications" component={Notifications} options={{
                ...CustomHeader,
                drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "notifications-sharp" : "notifications-outline"} size={size} color={color} />
                ),
                headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
            }} />
            <Drawer.Screen name="Orders" component={Orders} options={{
                ...CustomHeader,
                drawerIcon: ({ focused, color, size }) => (
                    <MaterialCommunityIcons name={focused ? "cart" : "cart-check"} size={size} color={color} />
                ),
                headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
            }} />
            <Drawer.Screen name="Settings" component={Settings} options={{
                ...CustomHeader,
                drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
                ),
                headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
            }} />
        </Drawer.Navigator>
    );
}

export default MyDrawer;
