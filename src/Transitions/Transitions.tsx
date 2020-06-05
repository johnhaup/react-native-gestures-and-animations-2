import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Button, Card, StyleGuide, cards } from "../components";
import { mix } from "../components/AnimatedHelpers";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: StyleGuide.spacing * 4,
  },
});
const origin = { x: -(width / 2 - StyleGuide.spacing * 2), y: 0 };

const UseTransition = () => {
  const [toggled, setToggle] = useState(false);
  const transition = useSharedValue(0);
  useEffect(() => {
    transition.value = toggled ? Math.PI / 6 : 0;
  }, [toggled, transition.value]);
  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => {
        const style = useAnimatedStyle(() => {
          const rotate = withTiming(
            (index - 1) * mix(transition.value, 0, Math.PI / 6),
            { duration: 500 }
          );
          return {
            transform: [
              { translateX: origin.x },
              { rotate },
              { translateX: -origin.x },
            ],
          };
        });
        return (
          <Animated.View key={card} style={[styles.overlay, style]}>
            <Card {...{ card }} />
          </Animated.View>
        );
      })}
      <Button
        label={toggled ? "Reset" : "Start"}
        primary
        onPress={() => setToggle((prev) => !prev)}
      />
    </View>
  );
};

export default UseTransition;
