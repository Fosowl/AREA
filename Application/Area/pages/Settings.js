import React, { useState } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account } from "../api/Account";
import Large_button from "../components/utils/buttons/Large_button";
import Container from "../components/utils/Container";
import Subtitle from "../components/utils/texts/Subtitle";
import Title from "../components/utils/texts/Title";
import ZoneInput from "../components/utils/ZoneInput";
import TextLink from "../components/utils/buttons/TextLink";
import Icon from "../components/utils/Icon";

export default function Settings({ route, navigation }) {
  const { pseudo, email, token } = route.params;
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [myPseudo, setMyPseudo] = useState(pseudo);
  const [showBox, setShowBox] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleSwitch2 = () => setIsEnabled2((previousState) => !previousState);
  const account = new Account(token);
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure ?",
      "Are you sure you want to delete this account ?",
      [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: () => {
            (async () => {
              await AsyncStorage.removeItem("userToken");
              await account.delete();
              navigation.navigate("Register");
            })();
            setShowBox(false);
          },
        },
      ]
    );
  };

  const updateProfil = () => {
    const firstName = undefined;
    const lastName = undefined;
    const phoneNumber = undefined;
    const picture = undefined;
    account.update({
      firstName,
      lastName,
      phoneNumber,
      picture,
      pseudo: myPseudo,
    });
    navigation.navigate("Profil", { tmp: "a" });
  };
  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon
          press={() => navigation.goBack()}
          path={require("../assets/back.png")}
        />
        <Title style={{ marginTop: 0, fontSize: 35 }} text="Settings" />
        <TextLink
          style={{ marginTop: 0, fontSize: 20, color: "red" }}
          text="Delete"
          press={showConfirmDialog}
        />
      </View>
      <Subtitle style={[styles.labels, { marginTop: 40 }]} text="Username" />
      <ZoneInput
        style={styles.zones}
        placeholder={pseudo}
        onChangeText={(text) => setMyPseudo(text)}
      />
      <Subtitle style={styles.labels} text="Password" />
      <ZoneInput style={styles.zones} editable="" placeholder="●●●●●●●●●●●●●" />
      <TextLink
        press={() => navigation.navigate("ChangePassword")}
        style={{
          color: "#9494EC",
          textDecorationLine: "underline",
          marginTop: 10,
        }}
        text="Change password"
      />
      <Subtitle style={[styles.labels, { marginTop: 20 }]} text="Email" />
      <ZoneInput style={styles.zones} editable="" placeholder={email} />
      <Subtitle style={styles.labels} text="Email communication" />
      <View style={styles.communication}>
        <Switch
          style={styles.switch}
          trackColor={{ false: "#222029", true: "#344A72" }}
          thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#222029"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Subtitle
          style={styles.description}
          text="Important alerts for your account"
        />
      </View>
      <View style={styles.communication}>
        <Switch
          style={styles.switch}
          trackColor={{ false: "#222029", true: "#344A72" }}
          thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
          ios_backgroundColor="#222029"
          onValueChange={toggleSwitch2}
          value={isEnabled2}
        />
        <Subtitle style={styles.description} text="News, tips, and features" />
      </View>
      <Large_button press={updateProfil} label="Save" color="#BD1919" />
    </Container>
  );
}

const styles = StyleSheet.create({
  communication: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  labels: {
    fontSize: 20,
    marginTop: 30,
  },
  zones: {
    marginTop: 10,
  },
  description: {
    marginLeft: 15,
    fontSize: 16,
  },
  switch: {
    marginTop: 14,
  },
});
