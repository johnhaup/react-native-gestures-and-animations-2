import * as React from "react";
import { StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerEventExtra,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import { canvas2Polar, clamp, polar2Canvas } from "react-native-redash";

import { StyleGuide } from "../../components";

const Cursor = ({
  r,
  strokeWidth,
  theta,
}: {
  r: number;
  strokeWidth: number;
  theta: Animated.SharedValue<number>;
}) => {
  const center = { x: r, y: r };
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offset: {
        x: number;
        y: number;
      };
    }
  >({
    onStart: (_, ctx) => {
      ctx.offset = polar2Canvas(
        {
          theta: theta.value,
          radius: r,
        },
        center
      );
    },
    onActive: (event, ctx) => {
      const { translationX, translationY } = event;
      const x = ctx.offset.x + translationX;
      const unclampedY = ctx.offset.y + translationY;
      const clampedY =
        theta.value < Math.PI
          ? clamp(unclampedY, 0, r - 0.001)
          : clamp(unclampedY, r, 2 * r);
      const y = x < r ? unclampedY : clampedY;
      const value = canvas2Polar({ x, y }, center).theta;
      // For SVG animation
      theta.value = value > 0 ? value : 2 * Math.PI + value;
    },
  });
  const style = useAnimatedStyle(() => {
    const { x: translateX, y: translateY } = polar2Canvas(
      {
        theta: theta.value,
        radius: r,
      },
      center
    );
    return {
      width: strokeWidth,
      height: strokeWidth,
      borderRadius: strokeWidth / 2,
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.cursor, style]} />
    </PanGestureHandler>
  );
};

export default Cursor;

const styles = StyleSheet.create({
  cursor: {
    ...StyleSheet.absoluteFillObject,
    borderColor: "white",
    borderWidth: 5,
    backgroundColor: StyleGuide.palette.primary,
  },
});
