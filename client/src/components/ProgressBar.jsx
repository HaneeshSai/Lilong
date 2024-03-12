import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import audiotest from "../assets/audiotest.mp3";

export default function ProgressBar({ isPlaying, audio }) {
  const [playbackTime, setPlaybackTime] = useState(0);
  const [dragX, setDragX] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaybackTime(audio?.currentTime);
    }, 500);

    return () => clearInterval(intervalId);
  }, [audio]);

  useEffect(() => {
    // Calculate the position of the draggable div based on playback time
    const maxWidth = 256; // Set your maximum width here
    const newPosition = (playbackTime / audio?.duration) * maxWidth;
    setDragX(newPosition);
  }, [playbackTime]);

  const onDragStopHandler = (e, data) => {
    const percent = data.x / 256; // Assuming maximum width is 256px
    const newTime = percent * audio?.duration;
    audio.currentTime = newTime;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentTimeFormatted = formatTime(playbackTime);
  const totalTimeFormatted = audio?.duration
    ? formatTime(audio?.duration)
    : "0:00";

  return (
    <div className="mb-2 relative bottom-1 w-[256px] h-[30px]">
      <Draggable
        axis="x"
        bounds="parent"
        position={{ x: dragX, y: 0 }}
        onStop={onDragStopHandler}
      >
        <div className="rounded-full absolute top-2 h-[14px] bg-slate-800 w-[14px] border-1 border-slate-800 cursor-pointer"></div>
      </Draggable>
      <div className="w-[256px] relative top-[14px] h-[0px] border-2 border-slate-800"></div>
      <div className="flex w-full justify-between relative top-6 text-sm">
        <p>{currentTimeFormatted}</p>
        <p>{totalTimeFormatted}</p>
      </div>
    </div>
  );
}
