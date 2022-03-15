import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Api from "../api/Api";
import Container from "../components/utils/Container";
import Header from "../components/utils/Header";
import Subtitle from "../components/utils/texts/Subtitle";
import Large_Button from "../components/utils/buttons/Large_button";
import { Account } from "../api/Account";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppletLogin({ route, navigation }) {
  const { name, uri, mode } = route.params;
  const [token, setToken] = useState("");
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("");

  async function getStatus() {
    if (mode == "activate") {
      setLabel("Already connected !");
      setStatus("Disconnect");
    } else if (mode == "deactivate") {
      setLabel("Connect your service account !");
      setStatus("Connect");
    } else {
      setLabel("Error ! Please Refresh");
      setStatus("Error");
    }
  }

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      setToken(token);
      await getStatus();
    })();
  }, []);

  async function handleConnectService() {
    if (mode == "activate") {
      const account = new Account(token);
      account.unlink_account_with(name);
      await getStatus();
      navigation.navigate("Dashboard", {view: "all"});
    } else if (mode == "deactivate") {
      const account = new Account(token);
      await account.link_account_with(name);
      await getStatus();
      navigation.navigate("Dashboard", {view: "all"});
    } else {
      navigation.navigate("AppletLogin");
    }
  }
  return (
    <Container>
      <Header
        press={() => navigation.goBack()}
        path={require("../assets/close.png")}
        label="Connect your service"
        style={{ width: 20, height: 20 }}
      />
      <Subtitle style={{ marginTop: 40 }} size={25} text={label} />
      <View style={{ display: "flex", alignItems: "center", marginTop: 60 }}>
        <Image
          source={{ uri: uri }}
          style={{ height: 120, width: 120, resizeMode: "contain" }}
        />
      </View>
      <Large_Button
        press={async () => handleConnectService()}
        label={status}
        color="#BD1919"
        style={{ marginTop: 60 }}
      />
    </Container>
  );
}
