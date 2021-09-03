import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "../../components";

import DraggableCard from "./DraggableCard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

interface DynamicSpringProps {
  width: number;
  height: number;
}

const DynamicSpring = ({ width, height }: DynamicSpringProps) => {
  const vector1 = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const vector2X = useDerivedValue(() => withSpring(vector1.x.value), [
    vector1.x,
  ]);
  const vector2Y = useDerivedValue(() => withSpring(vector1.y.value), [
    vector1.y,
  ]);
  const card2Styles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: vector2X.value },
        { translateY: vector2Y.value },
      ],
    };
  });

  const vector3X = useDerivedValue(() => withSpring(vector2X.value), [
    vector2X,
  ]);
  const vector3Y = useDerivedValue(() => withSpring(vector2Y.value), [
    vector2Y,
  ]);
  const card3Styles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: vector3X.value },
        { translateY: vector3Y.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, card3Styles]}>
        <Card card={Cards.Card3} />
      </Animated.View>
      <Animated.View style={[styles.card, card2Styles]}>
        <Card card={Cards.Card2} />
      </Animated.View>
      <DraggableCard width={width} height={height} vector={vector1} />
    </View>
  );
};

export default DynamicSpring;
