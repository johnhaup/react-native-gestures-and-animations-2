import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { useDerivedValue, interpolate } from "react-native-reanimated";

import { Vector } from "../components/AnimatedHelpers/Vector";
import { ReText } from "../components/AnimatedHelpers";
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
  const date = interpolate(x, [0, width], [domain.x[0], domain.x[1]]);
  return new Date(date);
};

const getPrice = (data, domain, y) => {
  "worklet";
  const price = interpolate(y, [0, width], [domain.y[0], domain.y[1]]);
  return price;
};

interface LabelProps {
  domain: Vector<[number, number]>;
  data: [number, number][];
  translate: Vector;
}

const formatMoney = (amount, decimalCount, decimal, thousands) => {
  "worklet";
  decimalCount = Math.abs(decimalCount);
  decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  const negativeSign = amount < 0 ? "-" : "";

  let i = `${Math.abs(amount).toFixed(0)}`;
  let j = i.length > 3 ? i.length % 3 : 0;

  return (
    negativeSign +
    (j ? i.substr(0, j) + thousands : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
    (decimalCount
      ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
      : "")
  );
};

const Label = ({ domain, data, translate }: LabelProps) => {
  const date = useDerivedValue(() => {
    const d = getDate(data, domain, translate.x.value);
    return d.toLocaleString();
  });
  const price = useDerivedValue(() => {
    const p = getPrice(data, domain, translate.y.value);
    return `$ ${formatMoney(p, 2, ".", ",")}`;
  });
  return (
    <View>
      <ReText style={styles.date} text={date} />
      <ReText style={styles.price} text={price} />
    </View>
  );
};

export default Label;
