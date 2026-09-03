import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll window to the top automatically whenever any route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
