import { useEffect, useState } from "react";

/**
 * Detects if the current viewport is “mobile” (width<768px).
 * Returns a boolean that updates on window resize.
 */
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialise from current window width to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
