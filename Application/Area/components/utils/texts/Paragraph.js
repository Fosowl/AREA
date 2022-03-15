import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Paragraph(props) {
  return <Text style={styles.paragraph}>{props.text}</Text>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "Roboto_400Regular",
    fontSize: 18,
    color: "#9E9E9E",
    marginTop: 20,
    lineHeight: 29,
  },
});
