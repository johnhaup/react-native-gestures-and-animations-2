import { useEffect } from "react";
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { bin } from "./Math";

export const useTransition = (
  state: boolean | number,
  config = { duration: 250 }
) => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = typeof state === "boolean" ? bin(state) : state;
  }, [state, value.value]);
  const transition = useDerivedValue(() => {
    return withTiming(value.value, config);
  });
  return transition;
};
