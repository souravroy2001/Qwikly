import { View, TextInput, StyleSheet, TextInputProps, useColorScheme } from "react-native";

interface CustomInputProps extends TextInputProps {
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function CustomInput({ leftIcon, style, ...props }: CustomInputProps) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={[styles.container, style]}>
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          {leftIcon}
        </View>
      )}
      <TextInput 
        style={[
          styles.input, 
          { backgroundColor: isDarkMode ? "#f1eae2" : "#124245", color: isDarkMode ? "#124245" : "#f1eae2" },
          leftIcon ? { paddingLeft: 40 } : {}
        ]} 
        {...props} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 17,
  },
  leftIconContainer: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  }
});
