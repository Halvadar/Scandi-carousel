import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { defaultCarouselItems } from "../data/defaultCarouselItems";
import PreviousNextSvg from "../public/PreviousNext.svg";
import {
  currentItemSizeSetter,
  itemArrayCentralizer,
  prevNextInterval,
  pointerMoveTranslatePropFunction,
  translatePropOverflowFunction,
  animationFinishedFunction,
} from "../functions/carouselFunctions";
import windowInfo from "./WindowInfo";
import ItemSelector from "./ItemSelector";
import CarouselItemsComponent from "./CarouselItemsComponent";

// angleBase is the amount of rotation in degrees you need to make on the item selector circle to make one item move.
const angleBase = 360 / defaultCarouselItems.length;
const CarouselContainer = styled.div`
  width: ${(props) => props.widthProp};
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    padding: 7%;
  }
  @media (max-width: 1024px) {
    width: 70%;
    height: 80%;
  }

  width: 50%;
  height: 70%;
  box-sizing: border-box;
  position: absolute;
  padding: 1%;

  left: 50%;
  transform: translateX(-50%);
  box-shadow: inset 0px 0px 8px gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PreviousNext = styled.div`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left && 0};
  right: ${(props) => props.right && 0};
  transform: ${(props) =>
    `translate(${props.left ? "-" : ""}50%,-50%) rotate(${
      props.left ? "180deg" : "0deg"
    })`};
  width: 5%;
  min-width: 40px;
  max-width: 70px;
  cursor: pointer;
  z-index: 3;
`;

const Carousel = ({ carouselItems }) => {
  // mounted ref is used so some of the useEffect hooks dont run on the initial render.
  const mounted = useRef(false);
  const { windowWidth, windowHeight, isMobile } = windowInfo();
  // Carousel items array is run through rearranger function that centralizes the first item.
  const [carouselItemsCentralized, setCarouselItemsCentralized] = useState(() =>
    itemArrayCentralizer(carouselItems)
  );
  // Prev current next size props which make sure the current item is the biggest in size.
  const [currentPrevNextItemSize, setCurrentItemSize] = useState({
    prev: 1,
    current: 1.3,
    next: 1,
  });
  // 3 states of different animations.
  const [buttonSlideAnimationInProgress, setButtonSlideAnimationInProgress] =
    useState(false);
  const [pointerSlideAnimationInProgress, setPointerSlideAnimationInProgress] =
    useState(false);
  const [itemSelectorAnimationInProgress, setItemSelectorAnimationInProgress] =
    useState(false);
  // pointer slide animation starting coordinate.
  const [pointerDownXCoordinate, setPointerDownXCoordinate] = useState(null);
  // current ball on the item selector circle.
  const [currentBall, setCurrentBall] = useState(0);

  const [translateProp, setTranslateProp] = useState(0);

  // Current pointer angle for the item selector circle.
  const [pointerAngle, setPointerAngle] = useState(0);
  const [currentItemWidth, setCurrentItemWidth] = useState(0);
  // carousel container translate value.
  const translatePropRef = useRef(0);
  const buttonSlideAnimationIntervalRef = useRef(null);
  const carouselItemsContainerRef = useRef(null);
  // currentBall value for when the pointer slide animation is on.
  const currentBallBase = useRef(0);
  // current item size setter useEffect. currentItemWidth is not defined on the inital render.
  useEffect(() => {
    if (currentItemWidth) {
      setCurrentItemSize(
        currentItemSizeSetter({ translateProp, currentItemWidth })
      );
    }
    // when the translateProp changes prev current and next item sizes are set accordingly.
  }, [currentItemWidth, translateProp]);
  useEffect(() => {
    // after pointer is down on the carousel container, pointerMoveFunction is set.
    const pointerMoveFunction = (event) => {
      event.preventDefault();

      const newTranslateProp = event.clientX - pointerDownXCoordinate;

      pointerMoveTranslatePropFunction({
        newTranslateProp,
        currentItemWidth,
        setPointerDownXCoordinate,
        setTranslateProp,
        event,
        setCarouselItemsCentralized,
        currentBallBase,
        defaultCarouselItems,
        setPointerAngle,
        setCurrentBall,
        angleBase,
      });
    };
    // pointer move event is only set when the buttonSlideAnimation is not in progress.
    if (pointerSlideAnimationInProgress && !buttonSlideAnimationInProgress) {
      carouselItemsContainerRef.current.addEventListener(
        "pointermove",
        pointerMoveFunction
      );
      return () => {
        carouselItemsContainerRef.current.removeEventListener(
          "pointermove",
          pointerMoveFunction
        );
      };
    }
  }, [
    pointerSlideAnimationInProgress,
    pointerDownXCoordinate,
    buttonSlideAnimationInProgress,
    currentItemWidth,
  ]);
  //

  useEffect(() => {
    mounted.current = true;
    const carouselItemsContainerRefCurrent = carouselItemsContainerRef.current;
    const pointerDownFunction = (event) => {
      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);
      setPointerSlideAnimationInProgress(true);
      setPointerDownXCoordinate(event.clientX);
    };
    const pointerUpFunction = (event) => {
      event.preventDefault();

      setPointerSlideAnimationInProgress(false);

      setPointerDownXCoordinate(null);
    };
    carouselItemsContainerRefCurrent.addEventListener(
      "pointerdown",
      pointerDownFunction
    );
    carouselItemsContainerRefCurrent.addEventListener(
      "pointerup",
      pointerUpFunction
    );
    return () => {
      carouselItemsContainerRefCurrent.removeEventListener(
        "pointerdown",
        pointerDownFunction
      );
      carouselItemsContainerRefCurrent.removeEventListener(
        "pointerup",
        pointerUpFunction
      );
      clearInterval(buttonSlideAnimationIntervalRef.current);
    };
  }, []);
  const buttonPreviousNextFunction = ({ prev, next }) => {
    // button slide animation does not happen if any animation is already in progress
    if (
      buttonSlideAnimationInProgress ||
      pointerSlideAnimationInProgress ||
      itemSelectorAnimationInProgress
    ) {
      return;
    }
    setButtonSlideAnimationInProgress(true);
    buttonSlideAnimationIntervalRef.current = prevNextInterval({
      prev,
      next,
      angleBase,
      buttonSlideAnimationIntervalRef,
      currentItemWidth,
      setButtonSlideAnimationInProgress,
      setTranslateProp,
      translatePropRef,
      setPointerAngle,
    });
    return () => {
      clearInterval(buttonSlideAnimationIntervalRef.current);
    };
  };

  useEffect(() => {
    if (
      mounted.current &&
      currentItemWidth &&
      !pointerSlideAnimationInProgress
    ) {
      // during the button or item selector animation, when the translate prop overflows, corresponding function is triggered.
      translatePropOverflowFunction({
        currentBallBase,
        currentItemWidth,
        setCarouselItemsCentralized,
        setTranslateProp,
        translateProp,
        defaultCarouselItems,
      });
    }
  }, [translateProp, pointerSlideAnimationInProgress, currentItemWidth]);
  useEffect(() => {
    if (
      !pointerSlideAnimationInProgress &&
      !buttonSlideAnimationInProgress &&
      !itemSelectorAnimationInProgress
    ) {
      // when the animations are finished animationFinished function is triggered to readjust the items.
      animationFinishedFunction({
        translateProp,
        currentItemWidth,
        setCarouselItemsCentralized,
        currentBallBase,
        defaultCarouselItems,
        setPointerAngle,
        setCurrentBall,
        setTranslateProp,
        angleBase,
      });
    }
  }, [
    pointerSlideAnimationInProgress,
    buttonSlideAnimationInProgress,
    itemSelectorAnimationInProgress,
    translateProp,
    currentItemWidth,
  ]);

  // Current Item Width Setter
  const currentItemCallbackRef = useCallback((el) => {
    if (el) {
      setCurrentItemWidth(el.offsetWidth);
    }
  }, []);
  return (
    <CarouselContainer>
      <PreviousNext
        left
        onClick={() => buttonPreviousNextFunction({ prev: true })}
      >
        <PreviousNextSvg />
      </PreviousNext>
      <CarouselItemsComponent
        carouselItems={carouselItemsCentralized}
        ref={carouselItemsContainerRef}
        currentItemCallbackRef={currentItemCallbackRef}
        currentItemWidth={currentItemWidth}
        currentPrevNextItemSize={currentPrevNextItemSize}
        isMobile={isMobile}
        translateProp={translateProp}
      >
        {carouselItemsCentralized.map((item, index) => {
          const { Item, id } = item;

          return (
            <Item
              key={id}
              index={index}
              carouselItemsLength={carouselItemsCentralized.length}
              currentPrevNextItemSize={currentPrevNextItemSize}
              isMobile={isMobile}
              currentItemCallbackRef={currentItemCallbackRef}
            />
          );
        })}
      </CarouselItemsComponent>

      <PreviousNext
        right
        onClick={() => buttonPreviousNextFunction({ next: true })}
      >
        <PreviousNextSvg />
      </PreviousNext>
      <ItemSelector
        setItemSelectorAnimationInProgress={setItemSelectorAnimationInProgress}
        itemSelectorAnimationInProgress={itemSelectorAnimationInProgress}
        pointerSlideAnimationInProgress={pointerSlideAnimationInProgress}
        buttonSlideAnimationInProgress={buttonSlideAnimationInProgress}
        translateProp={translateProp}
        setTranslateProp={setTranslateProp}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        currentItemWidth={currentItemWidth}
        currentBall={currentBall}
        setCurrentBall={setCurrentBall}
        pointerAngle={pointerAngle}
        setPointerAngle={setPointerAngle}
        currentBallBase={currentBallBase}
      />
    </CarouselContainer>
  );
};

export default Carousel;
