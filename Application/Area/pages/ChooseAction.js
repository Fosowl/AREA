import { View, Image, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import Container from "../components/utils/Container";
import Header from "../components/utils/Header";
import Subtitle from "../components/utils/texts/Subtitle";
import Large_Button from "../components/utils/buttons/Large_button";
import Api from "../api/Api";
import dataMatch from "../assets/data";

export default function ChooseAction({ route, navigation }) {
  const { name, mode, description } = route.params;
  const [data, setData] = useState([]);
  const [uri, setUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSaveAction = (Aname, prettyName) => {
    if (mode == "actions") {
      let data = dataMatch[name]["actions"][Aname];
      AsyncStorage.setItem("action", Aname);
      AsyncStorage.setItem("serviceAction", name);
      if (data === undefined) navigation.navigate("CreateApplet", { tmp: "a" });
      else navigation.navigate("FillInputs", { data: data, mode: mode });
    } else if (mode == "reactions") {
      let data = dataMatch[name]["reactions"][Aname];
      AsyncStorage.setItem("reaction", Aname);
      AsyncStorage.setItem("serviceReaction", name);
      navigation.navigate("FillInputs", { data: data, mode: mode });
    } else {
      AsyncStorage.removeItem("action");
      AsyncStorage.removeItem("serviceAction");
      AsyncStorage.removeItem("reaction");
      AsyncStorage.removeItem("serviceReaction");
      navigation.navigate("Dashboard");
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await Api.service.get_infos(name).then((service) => {
        if (mode == "actions") setData(service.actions);
        else if (mode == "reactions") setData(service.reactions);
        else setData("null");
        setUri(service.logo_url);
      });
      setIsLoading(false);
    })();
  }, []);
  if (isLoading == true) {
    listData = <ActivityIndicator size="large" />;
  } else {
    listData = data.map((name) => (
      <Large_Button
        key={name.name}
        press={() => handleSaveAction(name.name, name.pretty_name)}
        label={name.pretty_name}
        color="#BD1919"
        style={{ marginTop: 10 }}
      />
    ));
  }
  return (
    <Container>
      <Header
        press={() => navigation.goBack()}
        path={require("../assets/close.png")}
        label="Choose an action"
        style={{ width: 20, height: 20 }}
      />
      <View style={{ display: "flex", alignItems: "center", marginTop: 60 }}>
        <Image
          source={{ uri: uri ? uri : null }}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
      </View>
      <Subtitle
        style={{ marginTop: 40, marginBottom: 30 }}
        size={20}
        text={description}
      />
      <ScrollView showsVerticalScrollIndicator={false}>{listData}</ScrollView>
    </Container>
  );
}
