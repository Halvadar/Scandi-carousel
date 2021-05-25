import React, { useCallback, useEffect, useRef, useState } from "react";
import defaultCarouselItems from "../data/defaultCarouselItems";
import styled, { keyframes } from "styled-components";
import NextSvg from "../public/Next.svg";
import PreviousSvg from "../public/Previous.svg";
import {
  carouselItemMover,
  itemArrayCentralizer,
} from "../functions/carouselFunctions";
import windowInfo from "./WindowInfo";
import ItemSelector from "./ItemSelector";
import { usePreviousState } from "./customHooks";
const angleBase = 360 / defaultCarouselItems.length;
const CarouselContainer = styled.div`
  width: ${(props) => props.widthProp};
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    padding: 7%;
    padding-bottom: 3%;
  }
  @media (max-width: 1024px) {
    width: 70%;
    height: 80%;
  }
  width: 50%;
  height: 70%;
  box-sizing: border-box;
  position: absolute;
  padding: 3%;
  padding-bottom: 1%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  box-shadow: inset 0px 0px 8px gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CarouselItemsWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
`;
const CarouselItemsContainer = styled.div.attrs((props) => ({
  style: { transform: `translateX(${props.translateProp}px)` },
}))`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  cursor: pointer;
  touch-action: none;
`;
const PreviousNext = styled.div`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left && 0};
  right: ${(props) => props.right && 0};
  transform: ${(props) => `translate(${props.left ? "-" : ""}50%,-50%)`};
  width: 5%;
  min-width: 40px;
  max-width: 70px;
  cursor: pointer;
`;

const ItemWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    padding: 1%;
  }
  width: calc(100% / 3);
  flex-shrink: 0;
  overflow: hidden;

  display: inline-block;
  box-sizing: border-box;
  padding: 2%;
`;
const CarouselItem = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: cyan;
  user-select: none;
`;

const Carousel = () => {
  const mounted = useRef(false);
  const { windowWidth, windowHeight, isMobile } = windowInfo();
  const [carouselItems, setCarouselItems] = useState(() =>
    itemArrayCentralizer(defaultCarouselItems)
  );
  const [buttonSlideAnimationInProgress, setButtonSlideAnimationInProgress] =
    useState(false);
  const [pointerSlideAnimationInProgress, setPointerSlideAnimationInProgress] =
    useState(false);
  const [itemSelectorAnimationInProgress, setItemSelectorAnimationInProgress] =
    useState(false);
  const [pointerDownXCoordinate, setpointerDownXCoordinate] = useState(null);

  const [pointerMoveXCoordinate, setPointerMoveXCoordinate] = useState(null);
  const [currentBall, setCurrentBall] = useState(0);
  const [translateProp, setTranslateProp] = useState(0);
  const previousTranslateProp = usePreviousState(translateProp);
  //Current pointer angle for the item selector circle
  const [pointerAngle, setPointerAngle] = useState(0);
  const [currentItemWidth, setCurrentItemWidth] = useState(null);
  const translatePropRef = useRef(0);
  const buttonSlideAnimationIntervalRef = useRef(null);
  const carouselItemsContainerRef = useRef(null);

  useEffect(() => {
    const carouselItemsContainerRefCurrent = carouselItemsContainerRef.current;
    const pointerMoveFunction = (event) => {
      event.preventDefault();
      setPointerMoveXCoordinate(event.clientX);

      setTranslateProp(event.clientX - pointerDownXCoordinate);
    };
    if (pointerSlideAnimationInProgress && !buttonSlideAnimationInProgress) {
      carouselItemsContainerRefCurrent.addEventListener(
        "pointermove",
        pointerMoveFunction
      );
    }

    return () => {
      if (pointerSlideAnimationInProgress) {
        carouselItemsContainerRefCurrent.removeEventListener(
          "pointermove",
          pointerMoveFunction
        );
      }
    };
  }, [
    pointerSlideAnimationInProgress,
    pointerDownXCoordinate,
    pointerSlideAnimationInProgress,
  ]);
  //

  useEffect(() => {
    mounted.current = true;
    const carouselItemsContainerRefCurrent = carouselItemsContainerRef.current;
    const pointerDownFunction = (event) => {
      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);
      setPointerSlideAnimationInProgress(true);
      setpointerDownXCoordinate(event.clientX);
    };
    const pointerUpFunction = (event) => {
      event.preventDefault();
      event.target.releasePointerCapture(event.pointerId);
      setPointerSlideAnimationInProgress(false);
      setpointerDownXCoordinate(null);
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
    //animation does not happen if any animation is already in progress
    if (
      buttonSlideAnimationInProgress ||
      pointerSlideAnimationInProgress ||
      itemSelectorAnimationInProgress
    ) {
      return;
    }
    //depending on which button is clicked corresponding animation intervals are set.

    if (prev) {
      setButtonSlideAnimationInProgress(true);

      const buttonPrevAnimationInterval = setInterval(() => {
        if (translatePropRef.current < currentItemWidth) {
          //intervals are incrementing and decrementing the animation translate prop value untill the value exceeds the width of one carousel item.
          translatePropRef.current += 3;
          setTranslateProp(translatePropRef.current);
        } else {
          //prop gets set to 0 again and the interval is cleared. at the same time carouselItemMover function is triggered in useEffect and items get rotated.
          translatePropRef.current = 0;
          setButtonSlideAnimationInProgress(false);
          clearInterval(buttonSlideAnimationIntervalRef.current);
        }
      }, 5);
      buttonSlideAnimationIntervalRef.current = buttonPrevAnimationInterval;
    }
    if (next) {
      setButtonSlideAnimationInProgress(true);
      const buttonNextAnimationInterval = setInterval(() => {
        if (translatePropRef.current > -currentItemWidth) {
          translatePropRef.current = translatePropRef.current - 3;
          setTranslateProp(translatePropRef.current);
        } else {
          translatePropRef.current = 0;
          setButtonSlideAnimationInProgress(false);
          clearInterval(buttonSlideAnimationIntervalRef.current);
        }
      }, 5);
      buttonSlideAnimationIntervalRef.current = buttonNextAnimationInterval;
    }
  };

  // when the animations are finished carouselMover function is triggered to readjust the items
  useEffect(() => {
    if (mounted.current && currentItemWidth) {
      if (translateProp >= currentItemWidth) {
        if (pointerSlideAnimationInProgress) {
          setpointerDownXCoordinate(pointerMoveXCoordinate);
        }
        const howManyTimesGreater = Math.round(
          translateProp / currentItemWidth
        );

        setTranslateProp(
          (prevTranslateProp) =>
            prevTranslateProp - currentItemWidth * howManyTimesGreater
        );

        setCarouselItems((prevCarouselItems) =>
          carouselItemMover({
            arr: prevCarouselItems,
            moveLastToFirst: true,
            howManyTimes: howManyTimesGreater,
          })
        );
      }
      if (translateProp <= -currentItemWidth) {
        if (pointerSlideAnimationInProgress) {
          setpointerDownXCoordinate(pointerMoveXCoordinate);
        }

        const howManyTimesLesser = Math.round(
          -translateProp / currentItemWidth
        );

        setTranslateProp(
          (prevTranslateProp) =>
            prevTranslateProp + currentItemWidth * howManyTimesLesser
        );

        setCarouselItems((prevCarouselItems) =>
          carouselItemMover({
            arr: prevCarouselItems,
            moveFirstToLast: true,
            howManyTimes: howManyTimesLesser,
          })
        );
      }
      if (
        !pointerSlideAnimationInProgress &&
        !buttonSlideAnimationInProgress &&
        !itemSelectorAnimationInProgress
      ) {
        if (translateProp >= currentItemWidth / 2) {
          setCarouselItems((prevCarouselItems) => {
            return carouselItemMover({
              arr: prevCarouselItems,
              moveLastToFirst: true,
              howManyTimes: 1,
            });
          });
        }
        if (translateProp <= -currentItemWidth / 2) {
          setCarouselItems((prevCarouselItems) => {
            return carouselItemMover({
              arr: prevCarouselItems,
              moveFirstToLast: true,
              howManyTimes: 1,
            });
          });
        }
        //Sets the pointerAngle on the current item's exact degree value instead of where the pointer was when the animation finished
        setPointerAngle(currentBall * angleBase);
        setTranslateProp(0);
      }
    }
  }, [
    translateProp,
    pointerSlideAnimationInProgress,
    buttonSlideAnimationInProgress,
    itemSelectorAnimationInProgress,
  ]);

  useEffect(() => {
    if (buttonSlideAnimationInProgress || pointerSlideAnimationInProgress) {
      if (pointerAngle >= 360) {
        setPointerAngle(pointerAngle - 360);
      }
      if (pointerAngle < 0) {
        setPointerAngle(pointerAngle + 360);
      }
      const translatePropDifference = translateProp - previousTranslateProp;
      const anglifier = (translatePropArg) => {
        return (angleBase * translatePropArg) / currentItemWidth;
      };

      if (translatePropDifference <= -currentItemWidth) {
        setPointerAngle(
          (prevPointerAngle) =>
            prevPointerAngle +
            anglifier((currentItemWidth + translatePropDifference) * -1)
        );
      }
      if (translatePropDifference >= currentItemWidth) {
        setPointerAngle(
          (prevPointerAngle) =>
            prevPointerAngle +
            anglifier(currentItemWidth - translatePropDifference)
        );
      }
      if (
        translatePropDifference > 0 &&
        translatePropDifference < currentItemWidth
      ) {
        setPointerAngle(
          (prevPointerAngle) =>
            prevPointerAngle - anglifier(translatePropDifference)
        );
      }
      if (
        translatePropDifference < 0 &&
        translatePropDifference > -currentItemWidth
      ) {
        setPointerAngle(
          (prevPointerAngle) =>
            prevPointerAngle - anglifier(translatePropDifference)
        );
      }
    }
  }, [translateProp]);
  //Current Item Width Setter
  const currentItemCallbackRef = useCallback(
    (el) => {
      if (el) {
        setCurrentItemWidth(el.offsetWidth);
      }
    },
    [windowWidth]
  );
  return (
    <CarouselContainer>
      <PreviousNext
        left
        onClick={() => buttonPreviousNextFunction({ prev: true })}
      >
        <PreviousSvg />
      </PreviousNext>
      <CarouselItemsWrapper>
        <CarouselItemsContainer
          ref={carouselItemsContainerRef}
          translateProp={translateProp}
        >
          {carouselItems.map((item, index) => {
            const ref =
              index === Math.ceil(carouselItems.length / 2)
                ? currentItemCallbackRef
                : null;
            return (
              <ItemWrapper ref={ref}>
                <CarouselItem>{item.name}</CarouselItem>
              </ItemWrapper>
            );
          })}
        </CarouselItemsContainer>
      </CarouselItemsWrapper>
      <PreviousNext
        right
        onClick={() => buttonPreviousNextFunction({ next: true })}
      >
        <NextSvg />
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
      ></ItemSelector>
    </CarouselContainer>
  );
};

export default Carousel;
