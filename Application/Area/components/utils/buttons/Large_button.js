import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Large_button(props) {
  return (
    <TouchableOpacity
      onPress={props.press}
      style={[styles(props).button, props.style]}
    >
      <Text style={styles(props).buttonText}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = (props) =>
  StyleSheet.create({
    button: {
      width: 311,
      height: 62,
      backgroundColor: props.color,
      borderRadius: 21,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 'auto'
    },
    buttonText: {
      fontFamily: "Roboto_700Bold",
      fontSize: 18,
      color: "#FFFFFF",
    },
  });
