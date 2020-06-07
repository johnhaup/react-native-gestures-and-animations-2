import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  Extrapolate,
  interpolate,
} from "react-native-reanimated";

import {
  Path,
  getPointAtLength,
  useTranslate,
} from "../components/AnimatedHelpers";
import { useVector } from "../components/AnimatedHelpers/Vector";

const { width } = Dimensions.get("window");
const SIZE = 20;
const styles = StyleSheet.create({
  cursor: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "red",
  },
});

interface CursorProps {
  path: Path;
}

const Cursor = ({ path }: CursorProps) => {
  const translate = useVector(0, 0);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = translate.x.value;
      ctx.offsetY = translate.y.value;
    },
    onActive: (event, ctx) => {
      const x = ctx.offsetX + event.translationX;
      const length = interpolate(
        x,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
      const { y } = getPointAtLength(path, length);
      translate.x.value = x;
      translate.y.value = y;
    },
  });
  const style = useTranslate(translate);
  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View style={[styles.cursor, style]} />
      </PanGestureHandler>
    </View>
  );
};

export default Cursor;
