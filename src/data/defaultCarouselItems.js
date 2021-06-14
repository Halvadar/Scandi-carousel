import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
const FirstItem = ({ canPlay }) => {
  const videoRef = useRef();
  const [videoLoaded, setVideoLoaded] = useState(false);
  useEffect(() => {
    if (videoLoaded) {
      if (canPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 1.5;
      }
    }
  }, [canPlay, videoLoaded]);
  useEffect(() => {
    const canPlayFunction = () => {
      setVideoLoaded(true);
    };
    videoRef.current.addEventListener("canplay", canPlayFunction);
    return () => {
      videoRef.removeEventListener("canplay", canPlayFunction);
    };
  }, []);
  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: !videoLoaded ? "none" : null,
        }}
      >
        <source
          src={"https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"}
        />
      </video>
      <img
        style={{ display: videoLoaded ? "none" : null }}
        src={"https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"}
      />
    </>
  );
};

const SecondItem = () => (
  <img
    style={{
      objectFit: "cover",
      height: "100%",
      width: "100%",
      objectPosition: "center",
    }}
    src={
      "https://assets-global.website-files.com/6005fac27a49a9cd477afb63/60576840e7d265198541a372_bavassano_homepage_gp.jpg"
    }
  />
);
const ThirdItem = () => (
  <div
    style={{
      padding: "5%",

      fontSize: "1rem",
    }}
  >
    <h1 style={{ marginBottom: "10%" }}>Lorem Ipsum</h1>
    <p>lorem ipsum</p>
    <p>ipsum lorem</p>
    <p>lorem lorem ipsum ipsum lalalalala</p>
  </div>
);
const FourthItem = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      height: "100%",
      width: "100%",
    }}
  >
    <div>
      <img
        src={"https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"}
        style={{
          objectFit: "cover",
          height: "100%",
          width: "100%",
          objectPosition: "center",
        }}
      />
    </div>
    <div
      style={{
        borderTop: "1px solid black",
        textAlign: "center",
      }}
    >
      <h1>Header</h1>
      <p>Hello,there</p>
      <p>This is me</p>
    </div>
  </div>
);
const FifthItem = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "5% 0%",
        }}
      >
        <img
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
            objectPosition: "center",
          }}
          src={
            "https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
          }
        />
      </div>

      <h1>Luigi</h1>
      <div
        style={{
          width: "70%",
          height: "2px",
          borderRadius: "50%",
          background: "black",
        }}
      />
      <h2>Mazeratti</h2>
    </div>
  );
};
const SixthItem = () => (
  <img
    style={{
      objectFit: "cover",
      height: "100%",
      width: "100%",
      objectPosition: "center",
    }}
    src={"https://scx2.b-cdn.net/gfx/news/hires/2019/galaxy.jpg"}
  />
);
const SeventhItem = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      height: "100%",
      width: "100%",
    }}
  >
    <div>
      <img
        src={"http://i.imgur.com/HBaRG1I.png"}
        style={{
          objectFit: "cover",
          height: "100%",
          width: "100%",
          objectPosition: "center",
        }}
      />
    </div>
    <div
      style={{
        borderTop: "1px solid black",
        textAlign: "center",
      }}
    >
      <h1>Header</h1>
    </div>
  </div>
);
const EighthItem = () => (
  <div
    style={{
      padding: "5%",

      fontSize: "0.8rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <img
      src={
        "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
      }
      style={{
        objectFit: "cover",
        height: "100%",
        width: "100%",
        objectPosition: "center",
      }}
    />
    <h1 style={{ marginBottom: "10%", color: "black" }}>Psum Lorium</h1>
    <div
      style={{
        width: "90%",
        height: "2px",
        borderRadius: "50%",
        background: "black",
        marginBottom: "10%",
      }}
    />
    <p style={{ textAlign: "center" }}>
      Wild cherry pepsi as if magic johnson trl scrunched socks.
    </p>
  </div>
);

const NinthItem = ({ canPlay }) => {
  const videoRef = useRef();
  const [videoLoaded, setVideoLoaded] = useState(false);
  useEffect(() => {
    if (videoLoaded) {
      if (canPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 1.5;
      }
    }
  }, [canPlay]);
  useEffect(() => {
    const canPlayFunction = () => {
      setVideoLoaded(true);
    };
    videoRef.current.addEventListener("canplay", canPlayFunction);
    return () => {
      videoRef.removeEventListener("canplay", canPlayFunction);
    };
  }, []);
  return (
    <>
      <video
        ref={videoRef}
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: !videoLoaded ? "none" : null,
        }}
      >
        <source
          src={"https://samplelib.com/lib/download/mp4/sample-5s.mp4"}
          type="video/mp4"
        />
      </video>

      <img
        style={{ display: videoLoaded ? "none" : null }}
        src={"https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"}
      />
    </>
  );
};
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
export const defaultCarouselItems = [
  { component: FirstItem, type: "video", id: 0 },
  { component: SecondItem, type: "image", id: 1 },
  { component: ThirdItem, type: "p", id: 2 },
  { component: FourthItem, type: "mixed image", id: 3 },
  { component: FifthItem, type: "mixed image", id: 4 },
  { component: SixthItem, type: "image", id: 5 },
  { component: SeventhItem, type: "mixed image", id: 6 },
  { component: EighthItem, type: "mixed image", id: 7 },
  { component: NinthItem, type: "video", id: 8 },
].map((item) => {
  const Component = item.component;
  const type = item.type;
  return {
    Item: ({
      isMobile,
      currentItemCallbackRef,
      currentPrevNextItemSize,
      carouselItemsLength,
      index,
    }) => {
      const currentItem = index === Math.floor(carouselItemsLength / 2);
      const nextItem = index === Math.floor(carouselItemsLength / 2) + 1;
      const prevItem = index === Math.floor(carouselItemsLength / 2) - 1;
      const ref = currentItem ? currentItemCallbackRef : null;
      const scaleProp = () => {
        if (currentItem) {
          return currentPrevNextItemSize.current;
        }
        if (nextItem) {
          return currentPrevNextItemSize.next;
        }
        if (prevItem) {
          return currentPrevNextItemSize.prev;
        }
        return 1;
      };
      return (
        <ItemWrapper
          isMobile={isMobile}
          scaleProp={scaleProp()}
          key={item.id}
          ref={ref}
        >
          <CarouselItem isMobile={isMobile}>
            <Component canPlay={type === "video" ? currentItem : null} />
          </CarouselItem>
        </ItemWrapper>
      );
    },
    id: item.id,
  };
});
