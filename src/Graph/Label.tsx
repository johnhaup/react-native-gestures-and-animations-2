import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { useDerivedValue, interpolate } from "react-native-reanimated";

import { Vector } from "../components/AnimatedHelpers/Vector";
import { ReText, round } from "../components/AnimatedHelpers";
import { StyleGuide } from "../components";

const styles = StyleSheet.create({
  date: {
    ...StyleGuide.typography.title3,
    textAlign: "center",
  },
  price: {
    ...StyleGuide.typography.title2,
    textAlign: "center",
  },
});

interface LabelProps {
  value: { value: Vector<number> };
}

const Label = ({ value }: LabelProps) => {
  const date = useDerivedValue(() => {
    const d = new Date(value.value.x);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  const price = useDerivedValue(() => {
    const p = value.value.y;
    return `$ ${round(p, 2).toLocaleString("en-US", { currency: "USD" })}`;
  });
  return (
    <View>
      <ReText style={styles.date} text={date} />
      <ReText style={styles.price} text={price} />
    </View>
  );
};

export default Label;
