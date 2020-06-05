import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ScaleLinear, ScaleTime, scaleLinear, scaleTime } from "d3-scale";
import * as shape from "d3-shape";

const { width } = Dimensions.get("window");
const data = [
  { x: new Date(2020, 5, 1), y: 5012 },
  { x: new Date(2020, 4, 1), y: 8677 },
  { x: new Date(2020, 3, 1), y: 7188 },
  { x: new Date(2020, 2, 1), y: 5310 },
  { x: new Date(2020, 1, 1), y: 6198 },
  { x: new Date(2019, 12, 1), y: 4371 },
];

const Graph = () => {
  const scaleX = scaleTime()
    .domain([new Date(2020, 5, 1), new Date(2019, 12, 1)])
    .range([0, width]);
  const scaleY = scaleLinear().domain([0, 4371]).range([width, 0]);
  const d = shape
    .line()
    .x((d) => scaleX(d.x))
    .y((d) => scaleY(d.y))
    .curve(shape.curveBasis)(data);
  console.log({ d });
  return (
    <View>
      <Svg width={width} height={width}>
        <Path stroke="#3977e3" strokeWidth={5} {...{ d }} />
      </Svg>
    </View>
  );
};

export default Graph;
