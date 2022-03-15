import React, { useEffect, useState } from "react";
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

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token != null) navigation.navigate("Dashboard", { tmp: "a" });
    })();
  }, []);

  const handleLogin = () => {
    Api.oauth
      .login(email, password)
      .then((account) => {
        console.log(account);
        if (account.user) {
          const user = account.user;
          AsyncStorage.setItem("userToken", user);
          navigation.navigate("Dashboard", { tmp: "a" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container>
      <Icon
        press={() => navigation.goBack()}
        path={require("../assets/back.png")}
      />
      <View style={styles.view1}>
        <Title text="Let's sign you in." />
        <Subtitle text="Welcome back. You've been missed !" size={30} />
      </View>
      <ZoneInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <ZoneInput
        secure=""
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.view2}>
        <Paragraph text="Don't have an account ? "></Paragraph>
        <TextLink
          press={() => navigation.navigate("Register")}
          text="Register"
        />
      </View>
      <Large_button press={handleLogin} label="Sign In" color="#BD1919" />
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 35,
  },
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
