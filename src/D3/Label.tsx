import React from "react";
import { View, Dimensions } from "react-native";
import { useDerivedValue, interpolate } from "react-native-reanimated";

import { Vector } from "../components/AnimatedHelpers/Vector";
import { ReText } from "../components/AnimatedHelpers";

const { width } = Dimensions.get("window");
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

  let i = `${Math.abs(amount).toFixed(decimalCount)}`;
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
    //const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    //const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    //const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    //console.log(`${da}-${mo}-${ye}`);
    return d;
  });
  const price = useDerivedValue(() => {
    const p = getPrice(data, domain, translate.y.value);
    return `$ ${formatMoney(p, 2, ".", ",")}`;
  });
  return (
    <View>
      <ReText text={date} />
      <ReText text={price} />
    </View>
  );
};

export default Label;
