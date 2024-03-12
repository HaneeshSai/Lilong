import React, { useEffect, useState } from "react";
import pause from "../assets/icons/pause.png";
import back from "../assets/icons/backward.png";
import forward from "../assets/icons/forward.png";
import ProgressBar from "./ProgressBar";
import audiotest from "../assets/audiotest.mp3";
import axios from "axios";
import Cookies from "js-cookie";

export default function PlayBackPlayer({ track, audio, e }) {
  const [isplaying, setIsplaying] = useState(false);

  useEffect(() => {
    // Pause the previous audio when the component mounts or when audio prop changes
    const previousAudio = document.querySelector("audio");
    if (previousAudio && previousAudio !== audio) {
      previousAudio.pause();
      setIsplaying(false);
    }

    // Play the current audio if it's defined
    if (audio) {
      // Wait for the audio to load
      audio.addEventListener("loadeddata", () => {
        audio.play();
        setIsplaying(true);
      });
    }

    // updateLastPlayed();
    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
        setIsplaying(false);
      }
    };
  }, [audio]);

  const playPauseHandler = () => {
    setIsplaying(!isplaying);
    if (isplaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  // const updateLastPlayed = async () => {
  //   const response = await axios.post(
  //     `${import.meta.env.VITE_SERVER_URL}/tracks/update-lastPlayed`,
  //     {
  //       token: Cookies.get("token"),
  //       name: e.data? e.dat e.name,
  //     }
  //   );
  // };

  //e.img, e.name, e.artist

  return (
    <div className="w-full select-none border p-4 border-slate-400 bg-[#dfdfe1] rounded-xl">
      {!audio ? (
        <h1 className="text-center text-xl my-8">No Last Played Track</h1>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={e.img} alt="" className="h-[75px] rounded-lg" />
            <div>
              <h1 className="text-2xl w-64 truncate">{e.name}</h1>
              <p className="text-sm">{e.artist}</p>
            </div>
          </div>

          <div className="flex gap-5">
            <i className="fa-solid fa-backward-step text-3xl"></i>
            <div
              onClick={playPauseHandler}
              className="cursor-pointer w-6 flex items-center justify-center"
            >
              {isplaying ? (
                <i className="fa-solid fa-pause text-3xl"></i>
              ) : (
                <i className="fa-solid fa-play text-3xl ml-1"></i>
              )}
            </div>

            <i className="fa-solid fa-forward-step text-3xl"></i>
          </div>
          <div>
            <ProgressBar isPlaying={isplaying} audio={audio} />
          </div>
          <div className="flex justify-between gap-20 mr-5">
            <div>
              <button className="underline">Add to Favorites</button>
            </div>
            <div>
              <button className="underline">Lyrics</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
