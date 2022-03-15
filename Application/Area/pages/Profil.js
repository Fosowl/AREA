import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Container from "../components/utils/Container";
import Icon from "../components/utils/Icon";
import Navbar from "../components/Navbar";
import TextLink from "../components/utils/buttons/TextLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../api/Account";
import Subtitle from "../components/utils/texts/Subtitle";

export default function Profil({ route, navigation }) {
  const [token, setToken] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");
  const handleLogout = () => {
    AsyncStorage.removeItem("userToken");
    navigation.navigate("SignIn");
  };
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      setToken(token);
      const account = new Account(token);
      await account.get_infos().then((data) => {
        setPseudo(data.data.pseudo);
        setPicture(data.data.picture);
        setEmail(data.data.email);
      });
    })();
  }, [route]);
  return (
    <>
      <Container>
        <Icon
          press={() => navigation.navigate("Settings", {pseudo: pseudo, email: email, token: token})}
          path={require("../assets/settings.png")}
          style={{ marginLeft: "auto" }}
        />
        <TextLink
          style={{ marginTop: -20, width: 60 }}
          text="Logout"
          press={handleLogout}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require("../assets/logo.jpg")}
            style={{ width: 100, height: 100, borderRadius: 100 }}
          />
        </View>
        <Subtitle text={pseudo} size={26} style={{textAlign: "center"}}/>
        <Navbar />
      </Container>
    </>
  );
}
