import React from "react";
import styled from "styled-components";
const ItemWrapper = styled.div.attrs((props) => ({
  style: {
    transform: !props.isMobile ? `scale(${props.scaleProp})` : null,
    height: !props.isMobile ? "70%" : "100%",
    zIndex: props.scaleProp >= 1.15 ? 2 : 1,
  },
}))`
  @media (max-width: 768px) {
    width: 100%;
    padding: 1%;
  }
  backface-visibility: hidden;
  width: calc(100% / 3);
  flex-shrink: 0;
  display: inline-block;
  box-sizing: border-box;
  padding: 2%;
`;
const CarouselItem = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: white;
  user-select: none;
  box-shadow: ${(props) => (!props.isMobile ? "10px 10px 5px #aaaaaa" : null)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`;

const CarouselItemsComponent = ({
  currentPrevNextItemSize,
  isMobile,
  carouselItems,
  currentItemCallbackRef,
}) => {
  return (
    <>
      {carouselItems.map((item, index) => {
        const currentItem = index === Math.floor(carouselItems.length / 2);
        const nextItem = index === Math.floor(carouselItems.length / 2) + 1;
        const prevItem = index === Math.floor(carouselItems.length / 2) - 1;
        const ref = currentItem ? currentItemCallbackRef : null;
        const Component = item.component;
        return (
          <ItemWrapper
            isMobile={isMobile}
            scaleProp={
              currentItem
                ? currentPrevNextItemSize.current
                : nextItem
                ? currentPrevNextItemSize.next
                : prevItem
                ? currentPrevNextItemSize.prev
                : 1
            }
            key={item.id}
            ref={ref}
          >
            <CarouselItem isMobile={isMobile}>
              <Component canPlay={item.type === "video" ? currentItem : null} />
            </CarouselItem>
          </ItemWrapper>
        );
      })}
    </>
  );
};

export default CarouselItemsComponent;
