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
const CURSOR = 100;
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
  },
});

interface CursorProps {
  path: Path;
}

const Cursor = ({ path }: CursorProps) => {
  const point = getPointAtLength(path, 100);
  const translate = useVector(point.x - CURSOR / 2, point.y - CURSOR / 2);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = translate.x.value;
      ctx.offsetY = translate.y.value;
    },
    onActive: (event, ctx) => {
      const x0 = ctx.offsetX + event.translationX;
      const length = interpolate(
        x0,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
      const { x, y } = getPointAtLength(path, length);
      translate.x.value = x - CURSOR / 2;
      translate.y.value = y - CURSOR / 2;
    },
  });
  const style = useTranslate(translate);
  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View style={[styles.cursorContainer, style]}>
          <View style={styles.cursor} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Cursor;
