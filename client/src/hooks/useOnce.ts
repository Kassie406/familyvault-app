import { useRef, useEffect } from "react";
export function useOnce(cb: () => void) {
  const ran = useRef(false);
  useEffect(() => {
    if (!ran.current) { ran.current = true; cb(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}