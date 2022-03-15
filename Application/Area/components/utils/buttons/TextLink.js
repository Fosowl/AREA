import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TextLink(props) {
  return (
    <TouchableOpacity onPress={props.press}>
      <Text style={[styles.paragraph, props.style]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 20,
    lineHeight: 29,
  },
});
