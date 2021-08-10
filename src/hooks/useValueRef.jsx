import { useEffect, useRef } from "react";

export const useValueRef = (value) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, ref];
};
