import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function ZoneInput(props) {
  if (props.editable != null) {
    return (
      <TextInput
        editable={false}
        selectTextOnFocus={false}
        secureTextEntry
        style={[styles.input, props.style]}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor="#9E9E9E"
      ></TextInput>
    );
  } else if (props.secure != null) {
    return (
      <TextInput
        secureTextEntry
        style={[styles.input, props.style]}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor="#9E9E9E"
      ></TextInput>
    );
  } else {
    return (
      <TextInput
        style={[styles.input, props.style]}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor="#9E9E9E"
      ></TextInput>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 311,
    height: 62,
    borderRadius: 21,
    backgroundColor: "#222029",
    borderWidth: 2,
    borderColor: "#333333",
    color: "#9E9E9E",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    paddingLeft: 15,
    marginTop: 23,
  },
});
