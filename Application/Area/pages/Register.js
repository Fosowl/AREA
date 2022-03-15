import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Large_button from "../components/utils/buttons/Large_button";
import Container from "../components/utils/Container";
import Paragraph from "../components/utils/texts/Paragraph";
import Subtitle from "../components/utils/texts/Subtitle";
import Title from "../components/utils/texts/Title";
import ZoneInput from "../components/utils/ZoneInput";
import TextLink from "../components/utils/buttons/TextLink";
import Icon from "../components/utils/Icon";
import Api from "../api/Api";
import { ScrollView } from "react-native-web";

export default function Register({ navigation }) {
  const [pseudo, setPseudo] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const handleRegister = () => {
    Api.oauth
      .register(pseudo, email, password, password2)
      .then((account) => {
        console.log(account);
        if (!account.error) {
          setPseudo("")
          setEmail("")
          setPassword("")
          setPassword2("")
          navigation.navigate("SignIn");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container>
      <Icon
        press={() => navigation.navigate("Home")}
        path={require("../assets/back.png")}
      />
      <View style={styles.view1}>
        <Title text="Let's register." />
        <Subtitle text="Create your account now !" size={30} />
      </View>
      <ZoneInput
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
        placeholder="Pseudo"
      />
      <ZoneInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
      />
      <ZoneInput
        value={password}
        secure=""
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
      />
      <ZoneInput
        value={password2}
        secure=""
        onChangeText={(text) => setPassword2(text)}
        placeholder="Confirm Password"
      />
      <View style={styles.view2}>
        <Paragraph text="Already have an account ? "></Paragraph>
        <TextLink press={() => navigation.navigate("SignIn")} text="Login" />
      </View>
      <Large_button press={handleRegister} label="Register" color="#BD1919" />
    </Container>
  );
}

const styles = StyleSheet.create({
  view1: {
    marginTop: 15,
    marginBottom: 15,
  },
  view2: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
});
