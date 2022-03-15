import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Large_button from "../components/utils/buttons/Large_button";
import Container from "../components/utils/Container";
import Subtitle from "../components/utils/texts/Subtitle";
import Title from "../components/utils/texts/Title";
import ZoneInput from "../components/utils/ZoneInput";
import TextLink from "../components/utils/buttons/TextLink";
import Icon from "../components/utils/Icon";

export default function SignIn({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleSwitch2 = () => setIsEnabled2((previousState) => !previousState);
  return (
    <Container>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          press={() => navigation.goBack()}
          path={require("../assets/back.png")}
        />
        <Title
          style={{ marginTop: 0, marginLeft: 16, fontSize: 30 }}
          text="Change password"
        />
      </View>
      <Subtitle
        style={[styles.labels, { marginTop: 40 }]}
        text="Current password"
      />
      <ZoneInput style={styles.zones} placeholder="" />
      <TextLink
        style={{
          color: "#9494EC",
          textDecorationLine: "underline",
          marginTop: 10,
        }}
        text="Forgot password ?"
      />
      <Subtitle
        style={[styles.labels, { marginTop: 20 }]}
        text="New password"
      />
      <ZoneInput style={styles.zones} placeholder="" />
      <Subtitle style={styles.labels} text="Confirm new password" />
      <ZoneInput style={styles.zones} placeholder="" />
      <Large_button
        press={() => navigation.navigate("Settings")}
        label="Save"
        color="#BD1919"
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  communication: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  labels: {
    fontSize: 20,
    marginTop: 30,
  },
  zones: {
    marginTop: 10,
  },
  description: {
    marginLeft: 15,
    fontSize: 16,
  },
  switch: {
    marginTop: 14,
  },
});
