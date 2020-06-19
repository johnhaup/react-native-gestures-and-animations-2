import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { useDerivedValue, interpolate } from "react-native-reanimated";

import { Vector } from "../components/AnimatedHelpers/Vector";
import { ReText, round } from "../components/AnimatedHelpers";
import { StyleGuide } from "../components";

const { width } = Dimensions.get("window");
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
const getDate = (data, domain, x) => {
  "worklet";
  try {
    const date = interpolate(x, [0, width], [domain.x[0], domain.x[1]]);
    const refDate = (data.find(
      ([d], index) =>
        d > date && (!!data[index + 1] || data[index + 1][0] < date)
    ) || data[0])[0];
    return new Date(refDate);
  } catch (e) {
    console.log({ e });
    return new Date();
  }
};

const getPrice = (data, domain, y) => {
  "worklet";
  try {
    const price = interpolate(y, [width, 0], [domain.y[0], domain.y[1]]);
    const refPrice = (data.find(
      ([e, p], index) =>
        p > price && (!!data[index + 1] || data[index + 1][1] < price)
    ) || data[0])[1];
    return price;
  } catch (e) {
    console.log({ e });
    return 0;
  }
};

interface LabelProps {
  domain: Vector<[number, number]>;
  data: [number, number][];
  point: { value: Vector<number> };
}

const Label = ({ domain, data, point }: LabelProps) => {
  const date = useDerivedValue(() => {
    const d = getDate(data, domain, point.value.x);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  const price = useDerivedValue(() => {
    const p = getPrice(data, domain, point.value.y);
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
