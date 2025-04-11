import { View, Text, StatusBar, useColorScheme, ImageBackground, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'

type SplashProps = {
  onDone: () => void;
};

export default function Splash({ onDone }: SplashProps): React.JSX.Element {

  return (
    <ImageBackground source={require("../components/images/Splash-screen-image.jpeg")} resizeMode='cover' style={styles.background}>

      <View style={styles.overlay}>
        <StatusBar backgroundColor={"rgba(0, 0, 0, 0.84)"} barStyle={'light-content'} />

        <Image style={styles.logo} source={require("../components/images/qwikly-full-logo-light.png")} resizeMode='contain' />

        <Text style={styles.title}>Speed Meets Simplicity — <Text style={{ fontSize: 25 }}>Shop Smarter with Qwikly!</Text></Text>

        <Pressable onPress={onDone} style={({ pressed }) => [styles.actionBtn, { backgroundColor: pressed ? "#124245" : "#f1eae2" }]}>
          {({ pressed }) => (
            <Text style={[styles.actionBtnText, { color: pressed ? "#f1eae2" : "#124245" }]}> Let's Qwikly! </Text>
          )}
        </Pressable>
      </View>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    color: '#f1eae2',
    fontSize: 45,
    fontWeight: 600,
    fontFamily: "Fredoka-Bold",
    lineHeight: 50,
  },
  actionBtn: {
    backgroundColor: "#f1eae2",
    width: "80%",
    padding: 10,
    paddingVertical: 15,
    position: "absolute",
    bottom: 50,
    borderRadius: 20,
  },
  actionBtnText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 500,
    fontFamily: "Fredoka-Bold",
    color: '#124245'
  }
});
