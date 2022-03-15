import { View } from "react-native";
import React from "react";
import Icon from "./Icon";
import Title from "./texts/Title";

export default function Header(props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Icon press={props.press} path={props.path} style={props.style} />
      <Title
        style={{ marginTop: 0, marginLeft: 16, fontSize: 30 }}
        text={props.label}
      />
    </View>
  );
}
