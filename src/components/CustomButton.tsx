import { Text, Pressable, PressableProps, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'

interface CustomButtonProps extends PressableProps {
    title: string,
}

export default function CustomButton({ title, ...props }: CustomButtonProps) {
    const isDarkMode = useColorScheme() === "dark"

    return (
        <Pressable style={({ pressed }) => [styles.button, { backgroundColor: isDarkMode ? pressed ? "#f1eae2" : "#f47679" : pressed ? "#124245" : "#f47679" }]} {...props}>

            {({ pressed }) => <Text style={[styles.buttonText, { color: isDarkMode ? pressed ? "#124245" : "#f1eae2" : "#f1eae2" }]}> {title} </Text>}

        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: "100%",
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: "Fredoka-Bold",
        letterSpacing: 1,
    },

});
