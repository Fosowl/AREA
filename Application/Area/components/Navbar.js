import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Navbar() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard", {tmp: 'a'})}>
        <Image
          source={require("../assets/hut.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Services", {view: 'all'})}>
        <Image
          source={require("../assets/shop.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
        <Image
          source={require("../assets/logo.jpg")}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    alignItems: "flex-end",
    height: 50,
  },
});
