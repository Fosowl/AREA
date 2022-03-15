import { View, Image, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Container from "../components/utils/Container";
import Header from "../components/utils/Header";
import Large_button from "../components/utils/buttons/Large_button";
import Bloc from "../components/utils/Bloc";
import Api from "../api/Api";

export default function CreateApplet({ route, navigation }) {
  const { datasReactions, datasActions, customName } = route.params;
  const [token, setToken] = useState("");
  const [action, setAction] = useState("");
  const [serviceAction, setServiceAction] = useState("");
  const [reaction, setReaction] = useState("");
  const [serviceReaction, setServiceReaction] = useState("");
  const [customDatasActions, setCustomDatasActions] = useState({});
  const [customDatasReactions, setCustomDatasReactions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  async function setStockage() {
    const sa = await AsyncStorage.getItem("serviceAction");
    if (sa != null) setServiceAction(sa);
    const ac = await AsyncStorage.getItem("action");
    if (ac != null) setAction(ac);
    const sr = await AsyncStorage.getItem("serviceReaction");
    if (sr != null) setServiceReaction(sr);
    const rea = await AsyncStorage.getItem("reaction");
    if (rea != null) setReaction(rea);
  }
  const handleCreateWidget = () => {
    console.log("ACTIONS")
    console.log(customDatasActions)
    console.log(customDatasReactions)
    Api.widget.add(token, {
      action: {
        service: serviceAction,
        event: action,
        data: {
          ...customDatasActions,
        },
      },
      reaction: {
        service: serviceReaction,
        event: reaction,
        data: {
          ...customDatasReactions,
        },
      },
      name: customName,
    });
    navigation.navigate("Dashboard", { tmp: "k" });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      setToken(token);
      await setStockage();
      if (datasActions != '') setCustomDatasActions(datasActions)
      if (datasReactions != '') setCustomDatasReactions(datasReactions)
    })();
    setIsLoading(false);
  }, [route]);
  if (isLoading == true) {
    return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  } else {
    return (
      <Container>
        <Header
          press={() => navigation.goBack()}
          style={{ width: 20, height: 20 }}
          path={require("../assets/close.png")}
          label="Create your applet"
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bloc
            press={() =>
              navigation.navigate("Services", { mode: "actions", view: "spe" })
            }
            text={(serviceAction === "" && action === "") ? "If" : "If " + serviceAction + " " + action}
            style={{ marginTop: 100 }}
          />
          <Image
            source={require("../assets/arrow.png")}
            style={{ width: 90, height: 90, marginTop: 40, marginBottom: 40 }}
          />
          <Bloc
            press={() =>
              navigation.navigate("Services", {
                mode: "reactions",
                view: "spe",
              })
            }
            text={serviceReaction === "" && reaction === "" ? "Then" : "Then " + serviceReaction + " " + reaction}
          />
        </View>
        <Large_button
          press={() => handleCreateWidget()}
          label="Continue"
          color="#BD1919"
        />
      </Container>
    );
  }
}
