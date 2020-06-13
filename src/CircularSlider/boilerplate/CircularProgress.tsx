import React from "react";
import { StyleSheet, processColor } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { StyleGuide } from "../../components";

interface CircularProgressProps {
  theta: Animated.Node<number>;
  r: number;
  strokeWidth: number;
  stroke: any;
}

const CircularProgress = ({
  stroke,
  theta,
  r,
  strokeWidth,
}: CircularProgressProps) => {
  const radius = r - strokeWidth / 2;
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        {...{ strokeWidth }}
      />
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        {...{ strokeWidth }}
      />
    </Svg>
  );
};

export default CircularProgress;
