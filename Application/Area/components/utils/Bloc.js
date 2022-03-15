import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Subtitle from "./texts/Subtitle";

export default function Bloc(props) {
  return (
    <TouchableOpacity onPress={props.press}>
      <View style={[props.style, styles.container]}>
        <Subtitle size={25} text={props.text} style={{ marginTop: 0 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 311,
    height: 81,
    borderRadius: 21,
    backgroundColor: "#222029",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
