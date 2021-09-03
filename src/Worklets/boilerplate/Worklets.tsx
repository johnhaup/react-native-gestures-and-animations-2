import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, { runOnUI } from "react-native-reanimated";

import { Button } from "../../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

const formatDatetime = (datetime: Date) => {
  "worklet";
  return datetime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sayHello = (
  text: Animated.SharedValue<string>,
  from: string,
  cb: (v: string) => void
) => {
  "worklet";
  text.value = `Hello from ${from} on ${Platform.OS} at ${formatDatetime(
    new Date()
  )}`;
  cb(`Hello from ${from} on ${Platform.OS} at ${formatDatetime(new Date())}`);
};

const Worklets = () => {
  console.log(sayHello);
  return (
    <View style={styles.container}>
      <Button
        label="Say butt"
        primary
        onPress={() => runOnUI(sayHello)(text, "Irvine")}
      />
    </View>
  );
};

export default Worklets;
