import React, { forwardRef, Ref, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, View, Image, Text } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

interface SwiperProps {
  onSwipe: () => void;
  profile: {
    id: string;
    name: string;
    age: number;
    profile: number;
  };
  onTop: boolean;
}

const { width, height } = Dimensions.get("window");
const alpha = Math.PI / 12;
const swipeScale = 1.07;
const A =
  Math.sin(alpha) * height * swipeScale + Math.cos(alpha) * width * swipeScale;
const snapPoints = [-A, 0, A];

const swipe = (
  sharedValue: Animated.SharedValue<number>,
  destination: number,
  velocity: number,
  callback: () => void
) => {
  "worklet";
  sharedValue.value = withSpring(
    destination,
    { velocity, restSpeedThreshold: destination === 0 ? 0.01 : 100 },
    () => {
      if (destination !== 0) {
        runOnJS(callback)();
      }
    }
  );
};

export interface SwiperHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
}

const Swiper = ({ profile, onSwipe }: SwiperProps, ref: Ref<SwiperHandle>) => {
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  useImperativeHandle(ref, () => ({
    swipeLeft: () => {
      swipe(transX, -A, 5, onSwipe);
    },
    swipeRight: () => {
      swipe(transX, A, 5, onSwipe);
    },
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = transX.value;
      ctx.offsetY = transY.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      transX.value = translationX + ctx.offsetX;
      transY.value = translationY + ctx.offsetY;
    },
    onEnd: ({ velocityX, velocityY }) => {
      const dest = snapPoint(transX.value, velocityX, snapPoints);
      transY.value = withSpring(0, { velocity: velocityY });
      swipe(transX, dest, velocityX, onSwipe);
    },
  });

  const cardStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: transX.value },
        { translateY: transY.value },
        {
          rotate: interpolate(
            transX.value,
            [-width / 2, 0, width / 2],
            [alpha, 0, -alpha],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            transX.value,
            [-width / 2, 0, width / 2],
            [swipeScale, 1, swipeScale],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const likeStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        transX.value,
        [width / 10, width / 4],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const nopeStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        transX.value,
        [-width / 4, -width / 10],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[StyleSheet.absoluteFill, cardStyles]}>
        <Image style={styles.image} source={profile.profile} />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Animated.View style={[styles.like, likeStyles]}>
              <Text style={styles.likeLabel}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.nope, nopeStyles]}>
              <Text style={styles.nopeLabel}>NOPE</Text>
            </Animated.View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.name}>{profile.name}</Text>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default forwardRef(Swiper);

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
  },
  name: {
    color: "white",
    fontSize: 32,
  },
  like: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#6ee3b4",
  },
  likeLabel: {
    fontSize: 32,
    color: "#6ee3b4",
    fontWeight: "bold",
  },
  nope: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: "#ec5288",
  },
  nopeLabel: {
    fontSize: 32,
    color: "#ec5288",
    fontWeight: "bold",
  },
});
