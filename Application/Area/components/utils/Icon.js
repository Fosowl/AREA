import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";

export default function Icon(props) {
  return (
    <TouchableOpacity onPress={props.press}>
      <Image source={props.path} style={[styles.image, props.style]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
  },
});
