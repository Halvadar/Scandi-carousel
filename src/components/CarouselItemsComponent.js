import React, { forwardRef } from "react";
import styled from "styled-components";

const CarouselItemsWrapper = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  touch-action: none;
  overflow: hidden;
`;

const CarouselItemsContainer = styled.div.attrs((props) => ({
  style: {
    transform: `translateX(${props.translateBaseProp + props.translateProp}px)`,
  },
}))`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CarouselSlidingOverlay = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 10;
  cursor: pointer;
  transform: ${(props) => `translateX(${props.translateBaseProp}px)`};
`;

const CarouselItemsComponent = forwardRef(
  ({ carouselItems, currentItemWidth, translateProp, children }, ref) => {
    return (
      <CarouselItemsWrapper>
        <CarouselItemsContainer
          translateBaseProp={
            carouselItems.length % 2 === 0 ? -currentItemWidth / 2 : 0
          }
          translateProp={translateProp}
        >
          <CarouselSlidingOverlay
            ref={ref}
            translateBaseProp={
              carouselItems.length % 2 === 0 ? currentItemWidth / 2 : 0
            }
          />
          {children}
        </CarouselItemsContainer>
      </CarouselItemsWrapper>
    );
  }
);

export default CarouselItemsComponent;
