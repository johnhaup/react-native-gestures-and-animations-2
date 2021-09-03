import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { bin } from "react-native-redash";

import { Button, StyleGuide, cards } from "../../components";

import AnimatedCard from "./AnimatedCard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: "flex-end",
  },
});

const useSpring = (state: number | boolean) => {
  const sharedValue = useSharedValue(0);

  useEffect(() => {
    sharedValue.value = typeof state === "number" ? state : bin(state);
  }, [state, sharedValue]);

  return useDerivedValue(() => {
    return withSpring(sharedValue.value);
  });
};

const UseTransition = () => {
  // UI only
  const uiToggled = useSharedValue(false);
  const transition = useDerivedValue(() => {
    return withSpring(bin(uiToggled.value));
  });
  // JS
  // const [toggled, setToggle] = useState(false);
  // const transition = useSpring(toggled);

  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} {...{ index, card, transition }} />
      ))}
      <Button
        label={true ? "Reset" : "Start"}
        primary
        onPress={() => (uiToggled.value = !uiToggled.value)}
      />
    </View>
  );
};

export default UseTransition;
