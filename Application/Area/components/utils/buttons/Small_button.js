import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Small_button(props) {
  return (
    <TouchableOpacity
      onPress={props.press}
      style={styles(props).button}
    >
      <Text style={styles(props).buttonText}>{props.label}</Text>
    </TouchableOpacity>
  );
}

const styles = (props) =>
  StyleSheet.create({
    button: {
      width: 161,
      height: 62,
      backgroundColor: props.color,
      borderRadius: 21,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontFamily: "Roboto_700Bold",
      fontSize: 18,
      color: "#FFFFFF",
    },
  });
