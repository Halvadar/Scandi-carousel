import React, { useEffect, useState } from "react";

const windowInfo = () => {
  const [windowInfo, setWindowInfo] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    isMobile: window.innerWidth < 768,
  });

  useEffect(() => {
    const resizeFunction = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const isMobile = windowWidth <= 768;
      setWindowInfo({ windowWidth, windowHeight, isMobile });
    };
    window.addEventListener("resize", resizeFunction);
    return () => window.removeEventListener("resize", resizeFunction);
  });
  return windowInfo;
};
export default windowInfo;
