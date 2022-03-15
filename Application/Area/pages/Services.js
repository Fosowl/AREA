import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Container from "../components/utils/Container";
import Title from "../components/utils/texts/Title";
import Service from "../components/utils/Service";
import Navbar from "../components/Navbar";
import Header from "../components/utils/Header";
import Api from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Services({ route, navigation }) {
  const { view, mode } = route.params;
  const [data, setData] = useState([]);
  const [linked, setLinked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      setToken(token);
      await Api.service.all().then((services) => {
        setData(services);
      });
      await Api.service.available(token).then((services) => {
        setLinked(services.data);
      });
      setIsLoading(false);
    })();
  }, []);
  let listData = {};
  let header = {};
  if (isLoading == true) {
    listData = (
      <ActivityIndicator
        size="large"
        style={{ marginLeft: "46%", marginTop: 30 }}
      />
    );
    header = <></>;
  } else {
    // NOT LOADING
    if (view === "all") {
      header = <Title text="Services" style={{ fontSize: 30, marginTop: 0 }} />;
    } else if (view === "spe") {
      header = (
        <Header
          press={() => navigation.goBack()}
          path={require("../assets/close.png")}
          label="Choose a service"
          style={{ width: 20, height: 20 }}
        />
      );
    }
    if (view === "spe") {
      listData = data.map((data) => {
        if (linked.includes(data.name)) {
          return (
            <Service
              key={data.name}
              press={() =>
                navigation.navigate("ChooseAction", {
                  name: data.name,
                  uri: data.logo_url,
                  description: data.description,
                  mode: mode,
                })
              }
              border="#1FE31B"
              logo={{
                uri: data.logo_url,
              }}
              label={data.pretty_name}
            />
          );
        }
      });
    } else if (view === "all") {
      listData = data.map((data) => {
        if (linked.includes(data.name)) {
          return (
            <Service
              key={data.name}
              press={() =>
                navigation.navigate("AppletLogin", {
                  name: data.name,
                  uri: data.logo_url,
                  mode: "activate",
                })
              }
              border="#1FE31B"
              logo={{
                uri: data.logo_url,
              }}
              label={data.pretty_name}
            />
          );
        } else {
          return (
            <Service
              key={data.name}
              press={() =>
                navigation.navigate("AppletLogin", {
                  name: data.name,
                  uri: data.logo_url,
                  mode: "deactivate",
                })
              }
              border="#E24D4D"
              logo={{
                uri: data.logo_url,
              }}
              label={data.pretty_name}
            />
          );
        }
      });
    }
  }
  return (
    <Container>
      {header}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {listData}
        </View>
      </ScrollView>
      <Navbar />
    </Container>
  );
}
