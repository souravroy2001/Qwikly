import { createDrawerNavigator } from '@react-navigation/drawer';
import MyStack from './MyStack';
import Profile from 'screens/Profile';
import CustomDrawerContent from './CustomDrawerContent';
import Settings from 'screens/Settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomHeader from './CustomHeader';
import useThemeStore from 'zustand/themeState';


const Drawer = createDrawerNavigator();

function MyDrawer() {
    const { isDarkMode } = useThemeStore()
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
            <Drawer.Screen name="Profile" component={Profile}
                options={{
                    ...CustomHeader,
                    drawerIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={size} color={color} />
                    ),
                    headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" }
                }} />
            <Drawer.Screen name="Settings" component={Settings} options={{
                ...CustomHeader,
                drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
                )
            }} />
        </Drawer.Navigator>
    );
}

export default MyDrawer;
