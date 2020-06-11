import React from "react";
import {
  Dimensions,
  PixelRatio,
  StyleSheet,
  View,
  processColor,
} from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";

import Cursor from "./Cursor";
import CircularProgress from "./CircularProgress";
import { StyleGuide } from "../components";
import { interpolateColor } from "../components/AnimatedHelpers";

const { width } = Dimensions.get("window");
const size = width - 32;
const STROKE_WIDTH = 40;
const r = PixelRatio.roundToNearestPixel(size / 2);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: r * 2,
    height: r * 2,
  },
});

const CircularSlider = () => {
  const theta = useSharedValue(0);
  const stroke = useDerivedValue(() => {
    const color = interpolateColor(
      theta.value,
      [0, Math.PI, 2 * Math.PI],
      [4294916228, 4281894143, 4281925555]
    );
    return color;
  });
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <CircularProgress
            strokeWidth={STROKE_WIDTH}
            {...{ stroke, r, theta }}
          />
        </Animated.View>
        <Cursor
          strokeWidth={STROKE_WIDTH}
          r={r - STROKE_WIDTH / 2}
          {...{ theta, stroke }}
        />
      </View>
    </View>
  );
};

export default CircularSlider;
