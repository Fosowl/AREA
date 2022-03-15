import { ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Container from "../components/utils/Container";
import Header from "../components/utils/Header";
import Service from "../components/utils/Service";
import Api from "../api/Api";

export default function ChooseService({ route, navigation }) {
  const mode = route.params;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    Api.service.all().then((services) => {
      setData(services);
      setIsLoading(false);
    });
  }, []);
  if (isLoading == true) {
    listData = (
      <ActivityIndicator
        size="large"
        style={{ marginLeft: "50%", marginTop: 30 }}
      />
    );
  } else {
    listData = data.map((data) => (
      <Service
        key={data.name}
        press={() =>
          navigation.navigate("ChooseAction", {
            name: data.name,
            uri: data.logo_url,
            description: data.description,
            mode: 'actions',
          })
        }
        border="#E24D4D"
        logo={{
          uri: data.logo_url,
        }}
        label={data.pretty_name}
      />
    ));
  }
  return (
    <Container>
      <Header
        press={() => navigation.goBack()}
        path={require("../assets/close.png")}
        label="Choose a service"
        style={{ width: 20, height: 20 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 20 }}
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
    </Container>
  );
}
