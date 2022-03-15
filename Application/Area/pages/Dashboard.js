import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Container from "../components/utils/Container";
import Title from "../components/utils/texts/Title";
import Navbar from "../components/Navbar";
import Box from "../components/Box";
import Large_button from "../components/utils/buttons/Large_button";
import Api from "../api/Api";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Dashboard({ route, navigation, props }) {
  const [widgets, setWidgets] = useState([]);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBox, setShowBox] = useState(true);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure ?",
      "Are you sure you want to remove this widget ?",
      [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: () => {
            (async () => {
              await Api.widget.delete(token, id);
              await getWidgets();
            })();
            setShowBox(false);
          },
        },
      ]
    );
  };
  async function getWidgets() {
    await Api.widget.get_all(token).then((widgets) => {
      setWidgets(widgets);
    });
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      setToken(token);
      await AsyncStorage.removeItem("action");
      await AsyncStorage.removeItem("serviceAction");
      await AsyncStorage.removeItem("reaction");
      await AsyncStorage.removeItem("serviceReaction");
      await getWidgets();
      setIsLoading(false);
    })();
  }, [route]);
  let listData = {};
  if (isLoading == true) {
    listData = <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  } else {
    listData = widgets.map((data) => {
      return (
        <TouchableOpacity
          key={data.name}
          onPress={() => showConfirmDialog(data._id)}
        >
          <Box
            key={data.name}
            border="#1FE31B"
            text={
              data.name +
              "\n\nIf " +
              data.action.service +
              "(" +
              data.action.event +
              ")\nThen " +
              data.reaction.service +
              "(" +
              data.reaction.event +
              ")"
            }
          />
        </TouchableOpacity>
      );
    });
  }
  return (
    <Container>
      <Title
        text="AREA"
        style={{ fontSize: 30, marginTop: 0, marginBottom: 30 }}
      />
      <Large_button
        press={() =>
          navigation.navigate("CreateApplet", {
            datasReactions: "",
            datasActions: "",
            customName: "tmp",
          })
        }
        label="Add"
        color="#BD1919"
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {listData}
      </ScrollView>
      <Navbar />
    </Container>
  );
}
