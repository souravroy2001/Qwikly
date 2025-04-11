// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, StyleSheet } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import Notifications from 'screens/Notifications';
import Search from 'screens/Search';
import MyTabs from './MyTabs';
import CustomHeader from './CustomHeader';
import useThemeStore from 'zustand/themeState';


const Stack = createStackNavigator();

const MyStack: React.FC = () => {
    const { isDarkMode } = useThemeStore()
    return (
        <Stack.Navigator>

            <Stack.Screen name="Main" component={MyTabs} options={{ ...CustomHeader, headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2"}}} />

            <Stack.Screen name='Search' component={Search} options={({ navigation }) => ({
                title: "Search",
                headerLeft: () => (
                    <Pressable style={styles.backBtn} hitSlop={{ top: 30, right: 100, left: 100, bottom: 30 }} onPress={() => navigation.navigate("Main")}> <AntDesign name="arrowleft" size={30} color={"#f00"} /> </Pressable>
                )
            })} />
            <Stack.Screen name='Notifications' component={Notifications} options={({ navigation }) => ({
                title: "Notifications",
                headerLeft: () => (
                    <Pressable style={styles.backBtn} hitSlop={{ top: 30, right: 100, left: 100, bottom: 30 }} onPress={() => navigation.navigate("Main")}> <AntDesign name="arrowleft" size={30} color={"#f00"} /> </Pressable>
                )
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
