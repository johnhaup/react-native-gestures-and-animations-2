import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withRepeat,
} from "react-native-reanimated";
import {
  animationParameter,
  AnimationParameter,
  AnimationState,
  defineAnimation,
} from "react-native-redash";

// Custom Animations
interface PausableAnimationState extends AnimationState {
  lastTimestamp: number;
  elapsed: number;
}

const withPause = (
  animationParam: AnimationParameter,
  paused: Animated.SharedValue<boolean>
) => {
  "worklet";

  return defineAnimation(() => {
    "worklet";
    const nextAnimation = animationParameter(animationParam);
    const animation = (state: PausableAnimationState, now: number) => {
      if (paused.value) {
        state.elapsed = now - state.lastTimestamp;
        return false;
      }
      const finished = nextAnimation.animation(
        nextAnimation,
        now - state.elapsed
      );
      state.current = nextAnimation.current;
      state.lastTimestamp = now;
      return finished;
    };

    const start = (
      state: PausableAnimationState,
      value: number,
      now: number,
      previousAnimation: AnimationState
    ) => {
      state.elapsed = 0;
      state.lastTimestamp = now;
      nextAnimation.start(nextAnimation, value, now, previousAnimation);
    };

    return {
      animation,
      start,
    };
  });
};

import { Button, StyleGuide } from "../../components";

import ChatBubble from "./ChatBubble";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: StyleGuide.palette.background,
  },
});

const Timing = () => {
  const [play, setPlay] = useState(false);
  const paused = useSharedValue(!play);
  const progress = useSharedValue(0);
  return (
    <View style={styles.container}>
      <ChatBubble progress={progress} />
      <Button
        label={play ? "Pause" : "Play"}
        primary
        onPress={() => {
          setPlay((prev) => !prev);
          paused.value = !paused.value;
          if (progress.value === null) {
            progress.value = withPause(
              withRepeat(
                withTiming(1, {
                  duration: 1000,
                  easing: Easing.inOut(Easing.ease),
                }),
                -1,
                true
              ),
              paused
            );
          }
        }}
      />
    </View>
  );
};

export default Timing;
