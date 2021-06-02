import React, { useState, useRef, useEffect } from "react";

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
        ></source>
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
  ></img>
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
      ></img>
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
        ></img>
      </div>

      <h1>Luigi</h1>
      <div
        style={{
          width: "70%",
          height: "2px",
          borderRadius: "50%",
          background: "black",
        }}
      ></div>
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
  ></img>
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
      ></img>
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
    ></img>
    <h1 style={{ marginBottom: "10%", color: "black" }}>Psum Lorium</h1>
    <div
      style={{
        width: "90%",
        height: "2px",
        borderRadius: "50%",
        background: "black",
        marginBottom: "10%",
      }}
    ></div>
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
const data = [
  { component: FirstItem, type: "video", id: 0 },
  { component: SecondItem, type: "image", id: 1 },
  { component: ThirdItem, type: "p", id: 2 },
  { component: FourthItem, type: "mixed image", id: 3 },
  { component: FifthItem, type: "mixed image", id: 4 },
  { component: SixthItem, type: "image", id: 5 },
  { component: SeventhItem, type: "mixed image", id: 6 },
  { component: EighthItem, type: "mixed image", id: 7 },
  { component: NinthItem, type: "video", id: 8 },
];
export default data;
