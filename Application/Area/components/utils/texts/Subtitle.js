import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Subtitle(props) {
  return <Text style={[styles(props).title, props.style]}>{props.text}</Text>;
}

const styles = (props) =>
  StyleSheet.create({
    title: {
      fontFamily: "Roboto_700Bold",
      fontSize: props.size,
      color: "#FFFFFF",
      marginTop: 20,
    },
  });
