import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { StyleGuide } from "../../components";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  r,
  strokeWidth,
  theta,
}: {
  theta: Animated.SharedValue<number>;
  r: number;
  strokeWidth: number;
}) => {
  const radius = r - strokeWidth / 2;
  const circumference = radius * 2 * Math.PI;
  const animatedProps = useAnimatedProps(() => {
    return { strokeDashoffset: theta.value * radius };
  });
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <AnimatedCircle
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        stroke={StyleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        animatedProps={animatedProps}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};

export default CircularProgress;
