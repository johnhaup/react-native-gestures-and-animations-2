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
      /*
      console.log({ x, width, l: path.length });
      const length = interpolate(
        x,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
      console.log({ length });
      const point = getPointAtLength(path, length);
      */
      translate.x.value = ctx.offsetX + event.translationX;
      translate.y.value = ctx.offsetY + event.translationY;
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
