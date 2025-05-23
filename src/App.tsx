/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from 'routers/NavigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import AuthNavigator from 'routers/AuthNavigator';
import MyDrawer from 'routers/MyDrawer';
import Splash from 'screens/Splash';
import useAuthStore from 'zustand/authStore';
import Notifications from 'screens/Notifications';
import Search from 'screens/Search';
import Cart from 'screens/Cart';
import Favorites from 'screens/Favorites';
import Checkout from 'screens/Checkout';
import OrderSuccess from 'screens/OrderSuccess';
import Shop from 'screens/Shop';
import CustomHeader from 'routers/CustomHeader';



function App(): React.JSX.Element {

    /*
     * To keep the template simple and small we're adding padding to prevent view
     * from rendering under the System UI.
     * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
     * https://github.com/AppAndFlow/react-native-safe-area-context
     *
     * You can read more about it here:
     * https://github.com/react-native-community/discussions-and-proposals/discussions/827
     */
    // const [showSplash, setShowSplash] = useState(true);
    const { isLogin, showSplash, isDarkMode, syncUserData } = useAuthStore()
    const RootStack = createNativeStackNavigator();

    useEffect(() => {
        syncUserData()
    }, [])

    return (
        <NavigationContainer ref={navigationRef}>
            {!isLogin && showSplash ? (
                <Splash />
            ) : isLogin ? (
                <RootStack.Navigator>

                    <RootStack.Screen name="DrawerNav" component={MyDrawer} options={{ headerShown: false }} />

                    <RootStack.Screen name='Search' component={Search} options={() => ({
                        title: "Search",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='Notifications' component={Notifications} options={() => ({
                        title: "Notifications",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='Cart' component={Cart} options={() => ({
                        title: "Cart",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='Favorites' component={Favorites} options={() => ({
                        title: "Favorites",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='Checkout' component={Checkout} options={() => ({
                        title: "Checkout",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='OrderSuccess' component={OrderSuccess} options={() => ({
                        title: "Checkout",
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerTitleStyle: {
                            color: isDarkMode === "dark" ? "#f1eae2" : "#124245"
                        },
                        headerTintColor: isDarkMode === "dark" ? "#f1eae2" : "#124245",
                    })} />
                    <RootStack.Screen name='Shop' component={Shop} options={() => ({
                        ...CustomHeader,
                        headerStyle: { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" },
                        headerLeft: () => false
                    })} />

                </RootStack.Navigator>
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        marginLeft: 10,
    },
})

export default App;
