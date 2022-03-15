import { Switch, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function SliderButton() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <Switch
      style={styles.switch}
      trackColor={{ false: "#222029", true: "#344A72" }}
      thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
      ios_backgroundColor="#222029"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 133,
    height: 34,
  },
});
