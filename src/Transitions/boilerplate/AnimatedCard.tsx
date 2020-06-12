import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { mix } from "../../components/AnimatedHelpers";
import { Card, Cards, StyleGuide } from "../../components";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const origin = -(width / 2 - StyleGuide.spacing * 2);
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: StyleGuide.spacing * 4,
  },
});

interface AnimatedCardProps {
  toggled: boolean;
  index: number;
  card: Cards;
}

const AnimatedCard = ({ card, toggled, index }: AnimatedCardProps) => {
  const rotate = toggled ? ((index - 1) * Math.PI) / 6 : 0;

  return (
    <View
      style={[
        styles.overlay,
        {
          transform: [
            { translateX: origin },
            { rotate },
            { translateY: -origin },
          ],
        },
      ]}
    >
      <Card {...{ card }} />
    </View>
  );
};

export default AnimatedCard;
