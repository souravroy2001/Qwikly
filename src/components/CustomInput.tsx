import { View, Text, TextInput, StyleSheet, TextInputProps, useColorScheme } from "react-native";
import React from "react";


interface CustomInputProps extends TextInputProps {
  error?: string;
}

export default function CustomInput(props: CustomInputProps) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#f1eae2" : "#124245", color: isDarkMode ? "#124245" : "#f1eae2" }]} {...props} />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    fontSize: 17,
  },
});
