import React, { ReactElement } from "react";
import { ScrollView } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import SortableItem from "./SortableItem";

interface SortableListProps {
  children: ReactElement[];
  item: { width: number; height: number };
}

const SortableList = ({
  children,
  item: { height, width },
}: SortableListProps) => {
  const activeIndex = useSharedValue(-1);

  const offsets = children.map((_, i) => ({
    y: useSharedValue(height * i),
  }));

  const renderChild = (child: ReactElement, index: number) => {
    return (
      <SortableItem
        key={`drag_sort_${index}`}
        index={index}
        activeIndex={activeIndex}
        offsets={offsets}
        width={width}
        height={height}
      >
        {child}
      </SortableItem>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ height: height * children.length }}>
      {children.map(renderChild)}
    </ScrollView>
  );
};

export default SortableList;
