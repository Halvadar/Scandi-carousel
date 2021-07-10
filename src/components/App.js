import React from "react";
import Carousel from "./Carousel";
import { defaultCarouselItems } from "../data/defaultCarouselItems";
const App = () => {
  return <Carousel carouselItems={defaultCarouselItems} />;
};

export default App;
