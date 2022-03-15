import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import Subtitle from "./texts/Subtitle";

export default function Service(props) {
  return (
    <TouchableOpacity onPress={props.press}>
      <View style={styles(props).container}>
        <Image
          source={props.logo}
          style={{ width: 60, height: 60, resizeMode: "contain" }}
        />
        <Subtitle size={18} text={props.label} style={{ marginTop: 10 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#222029",
      borderRadius: 21,
      width: 135,
      height: 120,
      borderColor: props.border,
      borderWidth: 2,
      justifyContent: "center",
      marginTop: 30,
    },
  });
