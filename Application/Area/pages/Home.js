import React from "react";
import { Image, View } from "react-native";
import Small_button from "../components/utils/buttons/Small_button";
import Paragraph from "../components/utils/texts/Paragraph";
import Container from "../components/utils/Container";
import Title from "../components/utils/texts/Title";

export default function Home({ navigation }) {
  return (
    <Container>
      <Image source={require("../assets/home.png")} />
      <View style={{ alignSelf: "center" }}>
        <Title text="AREA" />
      </View>
      <Paragraph
        text="Automate your tasks based on certain actions. Optimize your time and
              improve your comfort. Thanks to AREA, automation will become your
              strong point."
      />
      <View
        style={{ display: "flex", flexDirection: "row", marginTop: "auto" }}
      >
        <Small_button
          label="Register"
          press={() => navigation.navigate("Register")}
          color="#BD1919"
        />
        <Small_button label="Sign In" press={() => navigation.navigate("SignIn")} color="#34343C" />
      </View>
    </Container>
  );
}
