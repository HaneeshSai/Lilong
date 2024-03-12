import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { useRef } from "react";
import TrackImg from "./TrackImg";
import SearchTrack from "./SearchTrack";

export default function NextInQue({
  header,
  tracks,
  mostPopular,
  setAudio,
  nowPlaying,
  userPlaylists,
  setRefreshSideBar,
}) {
  const swiperRef = useRef(null);

  const handleNextFourSlides = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };
  return (
    <div className="border select-none border-slate-400 p-3 px-5 rounded-xl bg-[#dfdfe1]">
      <div className="flex justify-between">
        <h1 className="my-2 underline">
          {mostPopular
            ? "Most Popular"
            : tracks
            ? "Search Results"
            : "Next in Que"}
        </h1>
        <p onClick={handleNextFourSlides} className=" cursor-pointer mr-4">
          More {">"}
        </p>
      </div>

      <div className=" w-[1100px]">
        <Swiper
          ref={swiperRef}
          slidesPerView={7}
          spaceBetween={15}
          grabCursor={true}
          modules={[]}
          freeMode
          allowSlideNext
          className="mySwiper "
          a11y={true}
        >
          {tracks
            ? tracks?.map((e, i) => (
                <SwiperSlide key={i} className=" ">
                  <SearchTrack
                    e={e}
                    setAudio={setAudio}
                    nowPlaying={nowPlaying}
                    userPlaylists={userPlaylists}
                    setRefreshSideBar={setRefreshSideBar}
                  />
                </SwiperSlide>
              ))
            : mostPopular?.map((e, i) => (
                <SwiperSlide key={i} className=" ">
                  <TrackImg
                    e={e}
                    setAudio={setAudio}
                    userPlaylists={userPlaylists}
                    nowPlaying={nowPlaying}
                    setRefreshSideBar={setRefreshSideBar}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
}
