// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import Notifications from 'screens/Notifications';
import Search from 'screens/Search';
import MyTabs from './MyTabs';
import CustomHeader from './CustomHeader';
import useAuthStore from 'zustand/authStore';
import { navigate } from './NavigationService';


const Stack = createStackNavigator();

const MyStack: React.FC = () => {
    const { isDarkMode } = useAuthStore()
    return (
        <Stack.Navigator>

            <Stack.Screen name="Main" component={MyTabs} options={{ ...CustomHeader, headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" } }} />

            <Stack.Screen name='Search' component={Search} options={() => ({
                title: "Search",
                headerLeft: () => (
                    <Pressable style={styles.backBtn} hitSlop={{ top: 30, right: 100, left: 100, bottom: 30 }} onPress={() => navigate("Main")}> <AntDesign name="arrowleft" size={30} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} /> </Pressable>
                ),
                headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                headerTitleStyle: {
                    color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                },
            })} />
            <Stack.Screen name='Notifications' component={Notifications} options={() => ({
                title: "Notifications",
                headerLeft: () => (
                    <Pressable style={styles.backBtn} hitSlop={{ top: 30, right: 100, left: 100, bottom: 30 }} onPress={() => navigate("Main")}> <AntDesign name="arrowleft" size={30} color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} /> </Pressable>
                ),
                headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                headerTitleStyle: {
                    color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                }
            })} />
        </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    backBtn: {
        marginLeft: 10,
    },
})

export default MyStack;
