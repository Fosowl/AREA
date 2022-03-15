import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Title(props) {
  return <Text style={[styles.title, props.style]}>{props.text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Roboto_700Bold",
    fontSize: 40,
    color: "#FFFFFF",
    marginTop: 20,
  },
});
