export const carouselItemMover = ({ arr, moveLastToFirst, howManyTimes }) => {
  if (moveLastToFirst) {
    //based on how many times the translate prop has overflown 1 item width, new carouselItems array is formed by splitting the old array in 2 and remerging them.
    return [
      ...arr.slice(arr.length - howManyTimes),
      ...arr.slice(0, arr.length - howManyTimes),
    ];
  }

  return [...arr.slice(howManyTimes), ...arr.slice(0, howManyTimes)];
};

export const itemArrayCentralizer = (arr) => {
  //first item in array is centralized
  const newArray = [...arr];
  const half = Math.ceil(newArray.length / 2);
  const secondHalf = newArray.splice(0, half);
  const firstHalf = newArray.splice(0);
  const concatedArray = [...firstHalf, ...secondHalf];

  return concatedArray;
};

export const currentBallBaseUpdater = ({
  prevCurrentBallBase,
  increment,
  itemsLength,
  howManyTimes,
}) => {
  const newValue = increment
    ? prevCurrentBallBase + howManyTimes
    : prevCurrentBallBase - howManyTimes;
  //if the new ball base is above carousel items length ot below 0 it gets readjusted so the pointerAngle value is allways withing 0-360 degrees.
  if (newValue >= itemsLength) {
    return newValue - itemsLength;
  }
  if (newValue < 0) {
    return newValue + itemsLength;
  }
  return newValue;
};

export const currentBallSetter = ({ pointerAngle, angleBase, itemsLength }) => {
  const newPointerAngle = () => {
    if (pointerAngle < 0) {
      return pointerAngle + 360;
    }
    if (pointerAngle > 360) {
      return pointerAngle - 360;
    }
    return pointerAngle;
  };

  const currentBall = Math.round(newPointerAngle() / angleBase);
  //pointer angle can be the same as itemsLength which is the same as 0. So in that case it gets reasigned 0.
  return currentBall > itemsLength - 1 ? 0 : currentBall;
};
export const currentItemSizeSetter = ({ translateProp, currentItemWidth }) => {
  const translatePropIncreasing = translateProp < 0 ? false : true;
  //we find the ratio of translateProp and currentItemWidth, which will be the coefficient of prev or next values based on if translateProp is increasing or decreasing. Max value each one can get is 1.3.
  const incrementDecrementCoefficient = translateProp / currentItemWidth;
  return {
    prev: translatePropIncreasing ? 1 + 0.3 * incrementDecrementCoefficient : 1,
    current: translatePropIncreasing
      ? 1.3 - 0.3 * incrementDecrementCoefficient
      : 1.3 - 0.3 * incrementDecrementCoefficient * -1,
    next: !translatePropIncreasing
      ? 1 + 0.3 * incrementDecrementCoefficient * -1
      : 1,
  };
};

export const prevNextInterval = ({
  prev,
  translatePropRef,
  currentItemWidth,
  angleBase,
  setTranslateProp,
  setButtonSlideAnimationInProgress,
  buttonSlideAnimationIntervalRef,
  setPointerAngle,
}) => {
  //depending on which button is clicked corresponding animation intervals are set.
  const eachTickTranslateValue = currentItemWidth / 50;
  const pointerAnglePlusMinusValue = angleBase / 50;
  if (prev) {
    return setInterval(() => {
      if (translatePropRef.current < currentItemWidth) {
        //intervals are incrementing and decrementing the animation translate prop value untill the value exceeds the width of one carousel item.
        translatePropRef.current += eachTickTranslateValue;
        setPointerAngle(
          (prevPointerAngle) => prevPointerAngle - pointerAnglePlusMinusValue
        );
        setTranslateProp(translatePropRef.current);
      } else {
        //prop gets set to 0 again and the interval is cleared. at the same time carouselItemMover function is triggered in useEffect and items get rotated.
        translatePropRef.current = 0;

        setButtonSlideAnimationInProgress(false);
        clearInterval(buttonSlideAnimationIntervalRef.current);
      }
    }, 5);
  } else {
    return setInterval(() => {
      if (translatePropRef.current > -currentItemWidth) {
        translatePropRef.current =
          translatePropRef.current - eachTickTranslateValue;
        setPointerAngle(
          (prevPointerAngle) => prevPointerAngle + pointerAnglePlusMinusValue
        );

        setTranslateProp(translatePropRef.current);
      } else {
        translatePropRef.current = 0;

        setButtonSlideAnimationInProgress(false);
        clearInterval(buttonSlideAnimationIntervalRef.current);
      }
    }, 5);
  }
};

export const pointerMoveTranslatePropFunction = ({
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
}) => {
  //if newTranslateProp is higher or lower than currentItemWidth, carouselItems are rearranged, newPointerDownXCoordinate is set, so the translateProp can get down to 0 again.
  if (newTranslateProp >= currentItemWidth) {
    const howManyTimes = Math.round(newTranslateProp / currentItemWidth);

    setPointerDownXCoordinate((prevPointerDownXCoordinate) => {
      const newPointerDownXCoordinate =
        prevPointerDownXCoordinate + currentItemWidth * howManyTimes;

      setTranslateProp(event.clientX - newPointerDownXCoordinate);
      return newPointerDownXCoordinate;
    });
    setCarouselItemsCentralized((prevCarouselItems) => {
      return carouselItemMover({
        arr: prevCarouselItems,
        moveLastToFirst: true,
        howManyTimes: howManyTimes,
      });
    });
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: false,
      itemsLength: defaultCarouselItems.length,
      howManyTimes: howManyTimes,
    });
  } else if (newTranslateProp <= -currentItemWidth) {
    const howManyTimes = Math.round(-newTranslateProp / currentItemWidth);

    setPointerDownXCoordinate((prevPointerDownXCoordinate) => {
      const newPointerDownXCoordinate =
        prevPointerDownXCoordinate - currentItemWidth * howManyTimes;

      setTranslateProp(event.clientX - newPointerDownXCoordinate);
      return newPointerDownXCoordinate;
    });

    setCarouselItemsCentralized((prevCarouselItems) =>
      carouselItemMover({
        arr: prevCarouselItems,
        moveFirstToLast: true,
        howManyTimes: howManyTimes,
      })
    );
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: true,
      itemsLength: defaultCarouselItems.length,
      howManyTimes: howManyTimes,
    });
  } else {
    setTranslateProp(newTranslateProp);
    const newPointerAngle =
      currentBallBase.current * angleBase +
      (newTranslateProp / currentItemWidth) * angleBase * -1;

    setPointerAngle(() => {
      return newPointerAngle;
    });
    setCurrentBall(
      currentBallSetter({
        pointerAngle: newPointerAngle,
        angleBase: angleBase,
        itemsLength: defaultCarouselItems.length,
      })
    );
  }
};

export const translatePropOverflowFunction = ({
  translateProp,
  currentItemWidth,
  setTranslateProp,
  currentBallBase,
  setCarouselItemsCentralized,
  defaultCarouselItems,
}) => {
  if (translateProp >= currentItemWidth) {
    const howManyTimes = Math.round(translateProp / currentItemWidth);

    setTranslateProp(
      (prevTranslateProp) => prevTranslateProp - currentItemWidth * howManyTimes
    );
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: false,
      itemsLength: defaultCarouselItems.length,
      howManyTimes: howManyTimes,
    });
    setCarouselItemsCentralized((prevCarouselItems) => {
      return carouselItemMover({
        arr: prevCarouselItems,
        moveLastToFirst: true,
        howManyTimes: howManyTimes,
      });
    });
  }
  if (translateProp <= -currentItemWidth) {
    const howManyTimes = Math.round(-translateProp / currentItemWidth);
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: true,
      itemsLength: defaultCarouselItems.length,
      howManyTimes: howManyTimes,
    });

    setTranslateProp(
      (prevTranslateProp) => prevTranslateProp + currentItemWidth * howManyTimes
    );

    setCarouselItemsCentralized((prevCarouselItems) =>
      carouselItemMover({
        arr: prevCarouselItems,
        moveFirstToLast: true,
        howManyTimes: howManyTimes,
      })
    );
  }
};
export const animationFinishedFunction = ({
  translateProp,
  currentItemWidth,
  setCarouselItemsCentralized,
  currentBallBase,
  defaultCarouselItems,
  setPointerAngle,
  setCurrentBall,
  setTranslateProp,
  angleBase,
}) => {
  //when the user releases the pointer, translateProp for the carousel can be in the middle of 2 items, so this function is run to determine which item needs to be selected.
  if (translateProp >= currentItemWidth / 2) {
    setCarouselItemsCentralized((prevCarouselItems) => {
      return carouselItemMover({
        arr: prevCarouselItems,
        moveLastToFirst: true,
        howManyTimes: 1,
      });
    });
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: false,
      howManyTimes: 1,
      itemsLength: defaultCarouselItems.length,
    });
  }
  if (translateProp <= -currentItemWidth / 2) {
    setCarouselItemsCentralized((prevCarouselItems) => {
      return carouselItemMover({
        arr: prevCarouselItems,
        moveFirstToLast: true,
        howManyTimes: 1,
      });
    });
    currentBallBase.current = currentBallBaseUpdater({
      prevCurrentBallBase: currentBallBase.current,
      increment: true,
      howManyTimes: 1,
      itemsLength: defaultCarouselItems.length,
    });
  }
  //Sets the pointerAngle on the current item's exact degree value instead of where the pointer was when the animation finished

  setPointerAngle(currentBallBase.current * angleBase);
  setCurrentBall(currentBallBase.current);

  setTranslateProp(0);
};

export const itemSelectorAnimationFunction = ({
  pointerMoveCoordinates,
  setPointerAngle,
  setTranslateProp,
  currentItemWidth,
  angleBase,
  setCurrentBall,
  defaultCarouselItems,
  pointerAngle,
}) => {
  //atan2 function returns the value in -180,180 range.
  const newPointerAngle =
    (Math.atan2(pointerMoveCoordinates.x, pointerMoveCoordinates.y) * 180) /
    Math.PI;
  //so we need to make it positive if it returns a negative value.
  const positivizedNewPointerAngle =
    newPointerAngle < 0 ? newPointerAngle + 360 : newPointerAngle;
  setPointerAngle(positivizedNewPointerAngle);

  const pointerAngleDifference = positivizedNewPointerAngle - pointerAngle;
  //if the pointerAngle difference is above 180 or below -180, for example if we jump from the first to last item, it would be ineffiecient to rotate the carousel in a clockwise direction, therefore difference is corrected so the rotation takes the shortest route.
  const pointerAngleDifferenceCorrected = () => {
    if (pointerAngleDifference < -180) {
      return pointerAngleDifference + 360;
    }
    if (pointerAngleDifference > 180) {
      return pointerAngleDifference - 360;
    }
    return pointerAngleDifference;
  };

  setTranslateProp((prevTranslateProp) => {
    return (
      prevTranslateProp +
      ((pointerAngleDifferenceCorrected() * currentItemWidth) / angleBase) * -1
    );
  });
  setCurrentBall(
    currentBallSetter({
      pointerAngle: positivizedNewPointerAngle,
      angleBase: angleBase,
      itemsLength: defaultCarouselItems.length,
    })
  );
};
