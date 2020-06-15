import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  Path,
  getPointAtLength,
  withDecay,
} from "../components/AnimatedHelpers";
import { Vector } from "../components/AnimatedHelpers/Vector";

const { width } = Dimensions.get("window");
const CURSOR = 100;
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#367be2",
    borderWidth: 4,
    backgroundColor: "white",
  },
});

interface CursorProps {
  path: Path;
  translate: Vector;
}

const Cursor = ({ path, translate }: CursorProps) => {
  const length = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP
      );
    },
    onActive: (event, ctx) => {
      const x0 = ctx.offsetX + event.translationX;
      length.value = interpolate(
        x0,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
      const { x, y } = getPointAtLength(path, length.value);
      translate.x.value = x - CURSOR / 2;
      translate.y.value = y - CURSOR / 2;
    },
    onEnd: ({ velocityX }) => {
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
      const { x, y } = getPointAtLength(path, length.value);
      translate.x.value = x - CURSOR / 2;
      translate.y.value = y - CURSOR / 2;
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translate.x.value },
        { translateY: translate.y.value },
      ],
    };
  });

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
