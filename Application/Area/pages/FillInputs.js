import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Container from "../components/utils/Container";
import Header from "../components/utils/Header";
import ZoneInput from "../components/utils/ZoneInput";
import Large_button from "../components/utils/buttons/Large_button";

export default function FillInputs({ route, navigation }) {
  const { data, mode } = route.params;
  let tmp2 = {};
  const [inputDatas, setInputDatas] = useState([]);
  const [widgetName, setWidgetName] = useState("Default");

  const handleDataChange = (text, data) => {
    tmp2[data.name] = text;
  };

  const CreateTrigger = () => {
    if (mode === "actions") {
      navigation.navigate("CreateApplet", {
        datasActions: tmp2,
        datasReactions: "",
        customName: widgetName,
      });
    } else if (mode === "reactions") {
      navigation.navigate("CreateApplet", {
        datasActions: "",
        datasReactions: tmp2,
        customName: widgetName,
      });
    }
  };

  useEffect(() => {
    let datas = [];
    Object.keys(data).forEach((key) => {
      let param = data[key];
      param.name = key;
      datas.push(param);
    });
    setInputDatas(datas);
  }, [route]);
  return (
    <Container>
      <Header
        press={() => navigation.goBack()}
        path={require("../assets/close.png")}
        label="Set The Trigger"
        style={{ width: 20, height: 20 }}
      />
      {mode === "reactions" ? (
        <ZoneInput
          key="name"
          value={widgetName}
          onChangeText={(text) => setWidgetName(text)}
          placeholder="Widget Name"
        />
      ) : null}
      {inputDatas.map((value) => {
        return (
          <ZoneInput
            key={value.name}
            value={value}
            onChangeText={(text) => handleDataChange(text, value)}
            placeholder={value.name}
          />
        );
      })}
      <Large_button press={CreateTrigger} label="Create" color="#BD1919" />
    </Container>
  );
}

const styles = StyleSheet.create({});
