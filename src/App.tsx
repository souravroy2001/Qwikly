/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import AuthNavigator from 'routers/AuthNavigator';
import MyDrawer from 'routers/MyDrawer';
import Splash from 'screens/Splash';


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
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <NavigationContainer>
            {!isLoggedIn && showSplash ? (
                <Splash onDone={() => setShowSplash(false)} />
            ) : isLoggedIn ? (
                <MyDrawer />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
}

export default App;
