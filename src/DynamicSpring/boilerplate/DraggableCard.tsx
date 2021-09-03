import React from "react";
import Animated, {
  useAnimatedGestureHandler,
  withDecay,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { clamp, Vector } from "react-native-redash";

import { Card, Cards, CARD_WIDTH, CARD_HEIGHT } from "../../components";
import { useTranslate } from "../../components/AnimatedHelpers";

interface DraggableCardProps {
  width: number;
  height: number;
  vector: Vector<Animated.SharedValue<number>>;
}

const DraggableCard = ({ width, height, vector }: DraggableCardProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = vector.x.value;
      ctx.offsetY = vector.y.value;
    },
    onActive: (event, ctx) => {
      vector.x.value = clamp(ctx.offsetX + event.translationX, 0, boundX);
      vector.y.value = clamp(ctx.offsetY + event.translationY, 0, boundY);
    },
    onEnd: ({ velocityX, velocityY }) => {
      vector.x.value = withDecay({
        velocity: velocityX,
        clamp: [0, boundX],
      });
      vector.y.value = withDecay({
        velocity: velocityY,
        clamp: [0, boundY],
      });
    },
  });
  const style = useTranslate(vector);
  return (
    <PanGestureHandler {...{ onGestureEvent }}>
      <Animated.View {...{ style }}>
        <Card card={Cards.Card1} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default DraggableCard;
