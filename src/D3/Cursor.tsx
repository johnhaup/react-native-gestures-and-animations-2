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
}

const Cursor = ({ path }: CursorProps) => {
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
    },
    onEnd: ({ velocityX }, ctx) => {
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    },
  });

  const style = useAnimatedStyle(() => {
    const { x, y } = getPointAtLength(path, length.value);
    const translateX = x - CURSOR / 2;
    const translateY = y - CURSOR / 2;
    return {
      transform: [{ translateX }, { translateY }],
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
