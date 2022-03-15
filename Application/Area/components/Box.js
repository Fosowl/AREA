import { View, StyleSheet } from "react-native";
import React from "react";
import Subtitle from "./utils/texts/Subtitle";
import SliderButton from "./utils/buttons/SliderButton";

export default function Box(props) {
  return (
    <View style={styles(props).container}>
      <Subtitle size={20} style={{marginTop: 0, textAlign: 'center'}} text={props.text} />
    </View>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      width: 311,
      height: 159,
      backgroundColor: "#222029",
      borderColor: props.border,
      borderWidth: 2,
      borderRadius: 21,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40
    },
  });
