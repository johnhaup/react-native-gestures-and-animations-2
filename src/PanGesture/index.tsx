import React, { useState } from "react";
import { StyleSheet, View, LayoutRectangle } from "react-native";

import PanGesture from "./boilerplate/PanGesture";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Demo = () => {
  const [container, setContainer] = useState<null | LayoutRectangle>(null);
  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) => setContainer(layout)}
    >
      {container && <PanGesture {...container} />}
    </View>
  );
};

export default Demo;
