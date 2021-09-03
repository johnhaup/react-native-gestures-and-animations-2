import React from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  // withDecay,
} from "react-native-reanimated";
import {
  animationParameter,
  AnimationParameter,
  clamp,
  defineAnimation,
  PhysicsAnimationState,
} from "react-native-redash";

import { Card, Cards, CARD_HEIGHT, CARD_WIDTH } from "../../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface GestureProps {
  width: number;
  height: number;
}

// Custom Animations
const VELOCITY_EPS = 5;
const deceleration = 0.997;

interface DecayAnimationState extends PhysicsAnimationState {
  lastTimestamp: number;
}

const withDecay = ({ intialVelocity }: { intialVelocity: number }) => {
  "worklet";
  return defineAnimation<DecayAnimationState>(() => {
    "worklet";
    const animation = (state: DecayAnimationState, now: number) => {
      const { velocity, lastTimestamp, current } = state;
      const deltaInTime = now - lastTimestamp;
      const v0 = velocity / 1000;
      const kv = Math.pow(deceleration, deltaInTime);
      const v = v0 * kv * 1000;
      const x = current + (v0 * deceleration * (1 - kv)) / (1 - deceleration);
      state.velocity = v;
      state.current = x;
      state.lastTimestamp = now;

      if (Math.abs(v) < VELOCITY_EPS) {
        return true;
      }

      return false;
    };

    const start = (
      state: DecayAnimationState,
      current: number,
      now: number
    ) => {
      // Initialize state of animation
      state.current = current;
      state.velocity = intialVelocity;
      state.lastTimestamp = now;
    };

    return {
      animation,
      start,
    };
  });
};

const withBouncing = (
  animationParam: AnimationParameter<PhysicsAnimationState>,
  lowerBound: number,
  upperBound: number
) => {
  "worklet";

  return defineAnimation<PhysicsAnimationState, any>(() => {
    "worklet";
    const nextAnimation = animationParameter(animationParam);
    const animation = (state: PhysicsAnimationState, now: number) => {
      const finished = nextAnimation.animation(nextAnimation, now);
      const { velocity, current } = nextAnimation;
      if (
        (velocity < 0 && current < lowerBound) ||
        (velocity > 0 && current > upperBound)
      ) {
        nextAnimation.velocity *= -1;
        nextAnimation.current = clamp(current, lowerBound, upperBound);
      }
      state.current = current;
      return finished;
    };
    const start = (
      state: PhysicsAnimationState,
      value: number,
      now: number,
      previousAnimation: Animation
    ) => {
      nextAnimation.start(nextAnimation, value, now, previousAnimation);
    };

    return {
      animation,
      start,
    };
  });
};

const Gesture = ({ width, height }: GestureProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;

  const onGestureEvent = useAnimatedGestureHandler<{
    offsetX: number;
    offsetY: number;
  }>({
    onStart: (event, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(event.translationX + ctx.offsetX, 0, boundX);
      translateY.value = clamp(event.translationY + ctx.offsetY, 0, boundY);
    },
    onEnd: (event) => {
      translateX.value = withBouncing(
        withDecay({
          intialVelocity: event.velocityX,
        }),
        0,
        boundX
      );
      translateY.value = withBouncing(
        withDecay({
          intialVelocity: event.velocityY,
        }),
        0,
        boundY
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View style={animatedStyle}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Gesture;
