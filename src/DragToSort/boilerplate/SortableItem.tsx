import React from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SortableItem = ({
  children,
  width,
  height,
  offsets,
  index,
  activeIndex,
}: {
  children: JSX.Element;
  index: number;
  activeIndex: Animated.SharedValue<number>;
  offsets: { y: Animated.SharedValue<number> }[];
  height: number;
  width: number;
}) => {
  const currentOffset = offsets[index].y;
  const isGestureActive = useSharedValue(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offset: number }
  >({
    onStart: (_, ctx) => {
      isGestureActive.value = true;
      ctx.offset = currentOffset.value;
      activeIndex.value = index;
    },
    onActive: (evt, ctx) => {
      x.value = evt.translationX;
      y.value = evt.translationY + ctx.offset;
      const offsetY = Math.round(y.value / height) * height;
      offsets.forEach((o, i) => {
        if (o.y.value === offsetY && i !== index) {
          o.y.value = currentOffset.value;
          currentOffset.value = offsetY;
        }
      });
    },
    onEnd: () => {
      isGestureActive.value = false;
      x.value = withSpring(0);
      y.value = withSpring(offsets[index].y.value);
    },
  });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return y.value;
    }
    return withSpring(currentOffset.value);
  }, [isGestureActive]);

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width,
      height,
      zIndex: activeIndex.value === index ? 100 : 1,
      transform: [
        { translateY: translateY.value },
        { translateX: x.value },
        {
          scale: withSpring(isGestureActive.value ? 1.1 : 1, { velocity: 0.9 }),
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export default SortableItem;
