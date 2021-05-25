import { useRef, useEffect } from "react";

export const usePreviousState = (stateValue) => {
  const previousState = useRef(null);
  useEffect(() => {
    previousState.current = stateValue;
  }, [stateValue]);
  return previousState.current;
};
