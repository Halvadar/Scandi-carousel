import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import styled from "styled-components";
import { defaultCarouselItems } from "../data/defaultCarouselItems";
import { itemSelectorAnimationFunction } from "../functions/carouselFunctions";
const angleBase = 360 / defaultCarouselItems.length;

const ItemSelectorContainer = styled.div`
  position: absolute;
  cursor: pointer;
  height: 100px;
  width: 100px;
  top: 100%;
  touch-action: none;
`;
const BallCentralizer = styled.div.attrs((props) => ({
  style: { width: props.widthProp + "px", height: props.heightProp + "px" },
}))`
  position: absolute;
  left: 50%;
  bottom: 50%;
  transition: width 0.5s, height 0.5s;
  pointer-events: none;
`;

const Ball = styled.div.attrs((props) => ({
  style: {
    background: props.highlightedBall ? "rgb(0, 8, 255)" : "initial",
  },
}))`
  width: 6px;
  height: 6px;
  border: 2px solid rgb(76, 118, 255);
  border-radius: 50%;
  position: absolute;
  left: ${(props) => props.leftProp + "%"};
  bottom: ${(props) => props.bottomProp + "%"};
  transform: translate(-3px, 3px);
`;
const ItemSelector = ({
  itemSelectorAnimationInProgress,
  setItemSelectorAnimationInProgress,
  buttonSlideAnimationInProgress,
  pointerSlideAnimationInProgress,
  setTranslateProp,
  windowWidth,
  windowHeight,
  currentItemWidth,
  currentBall,
  setCurrentBall,
  pointerAngle,
  setPointerAngle,
  currentBallBase,
}) => {
  //mounted ref is used so some of the useEffect hooks dont run on the initial render.
  const mounted = useRef(false);
  const itemSelectorContainerRef = useRef(null);
  //Point from which the ball coordinates are calculated
  const [centerPointCoordinates, setCenterPointCoordinates] = useState({
    x: null,
    y: null,
  });
  //Current pointer Coordinates
  const [pointerMoveCoordinates, setPointerMoveCoordinates] = useState({
    x: null,
    y: null,
  });

  const ballsCentralizerRef = useCallback(
    (el) => {
      if (el) {
        const ballsCentralizerRect = el.getBoundingClientRect();
        //y coordinate is top + height because the central point is the bottom left corner of the ballsCentralizer element.
        setCenterPointCoordinates({
          x: ballsCentralizerRect.left,
          y: ballsCentralizerRect.top + ballsCentralizerRect.height,
        });
      }
    },
    [windowWidth, windowHeight]
  );
  //useEffect that runs on the inital render to set mounted to true and pointerDown and pointerUp events on the itemSelector container.
  useEffect(() => {
    mounted.current = true;
    const itemSelectorPointerDownFunction = (event) => {
      event.preventDefault();
      event.target.setPointerCapture(event.pointerId);
      //y coordinate is calculated backwards, because we want the y coordinate to increase from the bottom up. This way both the y and x coordinates are positive in the upper right corner of the circle and the rotation angle increases clockwise around it.
      setPointerMoveCoordinates(() => {
        return {
          x: event.clientX - centerPointCoordinates.x,
          y: centerPointCoordinates.y - event.clientY,
        };
      });

      setItemSelectorAnimationInProgress(true);
    };
    const itemSelectorPointerUpFunction = (event) => {
      event.preventDefault();
      event.target.releasePointerCapture(event.pointerId);

      setItemSelectorAnimationInProgress(false);
    };
    if (!pointerSlideAnimationInProgress && !buttonSlideAnimationInProgress) {
      itemSelectorContainerRef.current.addEventListener(
        "pointerdown",
        itemSelectorPointerDownFunction
      );
      itemSelectorContainerRef.current.addEventListener(
        "pointerup",
        itemSelectorPointerUpFunction
      );
    }

    return () => {
      if (!pointerSlideAnimationInProgress && !buttonSlideAnimationInProgress) {
        itemSelectorContainerRef.current.removeEventListener(
          "pointerdown",
          itemSelectorPointerDownFunction
        );
        itemSelectorContainerRef.current.removeEventListener(
          "pointerup",
          itemSelectorPointerUpFunction
        );
      }
    };
  }, [
    centerPointCoordinates,
    buttonSlideAnimationInProgress,
    pointerSlideAnimationInProgress,
  ]);
  //pointerMove event is added to the itemSelector container when the pointer is already down on it and the pointerMove coordinates get updated on each move.
  useEffect(() => {
    if (itemSelectorAnimationInProgress) {
      const pointerMoveFunction = (event) => {
        event.preventDefault();
        setPointerMoveCoordinates(() => {
          return {
            x: event.clientX - centerPointCoordinates.x,
            y: centerPointCoordinates.y - event.clientY,
          };
        });
      };
      itemSelectorContainerRef.current.addEventListener(
        "pointermove",
        pointerMoveFunction
      );
      return () => {
        itemSelectorContainerRef.current.removeEventListener(
          "pointermove",
          pointerMoveFunction
        );
      };
    }
  }, [itemSelectorAnimationInProgress, centerPointCoordinates]);
  useEffect(() => {
    if (itemSelectorAnimationInProgress) {
      itemSelectorAnimationFunction({
        pointerMoveCoordinates,
        setPointerAngle,
        setTranslateProp,
        currentItemWidth,
        angleBase,
        setCurrentBall,
        defaultCarouselItems,
        pointerAngle,
      });
    }
  }, [pointerMoveCoordinates, itemSelectorAnimationInProgress]);

  const balls = useMemo(
    () =>
      defaultCarouselItems.map((item, index) => {
        //left and bottom values of the balls around the circle are the sines and cosines of a 200px hypothenus triangle with a corresponding index angle.
        const leftValue = Math.sin((angleBase * index * Math.PI) / 180) * 200;
        const bottomValue = Math.cos((angleBase * index * Math.PI) / 180) * 200;
        return (
          <Ball
            highlightedBall={currentBall === index}
            key={item.id}
            leftProp={leftValue}
            bottomProp={bottomValue}
          ></Ball>
        );
      }),
    [currentBall]
  );

  return (
    <ItemSelectorContainer ref={itemSelectorContainerRef}>
      <BallCentralizer
        ref={ballsCentralizerRef}
        widthProp={itemSelectorAnimationInProgress ? 30 : 10}
        heightProp={itemSelectorAnimationInProgress ? 30 : 10}
      >
        {balls}
      </BallCentralizer>
    </ItemSelectorContainer>
  );
};

export default ItemSelector;
