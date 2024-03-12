import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize);

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  function getScreenSize() {
    const width = window.innerWidth;

    if (width < 600) {
      return "small";
    } else if (width >= 600 && width < 1200) {
      return "medium";
    } else {
      return "large";
    }
  }

  return screenSize;
};

export default useScreenSize;
