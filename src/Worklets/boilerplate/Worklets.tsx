import React from "react";
import { View, StyleSheet } from "react-native";

import { Button } from "../../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

const Worklets = () => {
  return (
    <View style={styles.container}>
      <Button label="Say Hello" primary onPress={() => null} />
    </View>
  );
};

export default Worklets;
