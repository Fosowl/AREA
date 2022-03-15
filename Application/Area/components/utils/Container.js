import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";

export default function Container(props) {
  return (
    <KeyboardAvoidingView style={styles.global} behavior="header">
      <SafeAreaView>
        <View style={styles.container}>{props.children}</View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  global: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    width: "80%",
    height: "95%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "auto",
  },
});
