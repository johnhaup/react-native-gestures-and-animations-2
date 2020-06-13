import * as React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  canvas2Polar,
  polar2Canvas,
  clamp,
} from "../../components/AnimatedHelpers";
import { StyleGuide } from "../../Examplescomponents";

const THRESHOLD = 0.001;

interface CursorProps {
  r: number;
  theta: any;
  strokeWidth: number;
  stroke: any;
}

const Cursor = ({ r, theta, strokeWidth, stroke }: CursorProps) => {
  return (
    <View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          width: strokeWidth,
          height: strokeWidth,
          borderRadius: strokeWidth / 2,
          borderColor: "white",
          borderWidth: 5,
        },
      ]}
    />
  );
};

export default Cursor;
