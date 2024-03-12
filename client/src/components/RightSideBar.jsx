import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RightSideBar({
  selectedPlaylist,
  setAudio,
  refreshSideBar,
  nowPlaying,
  setIsloading,
  isloading,
}) {
  const [playlistTracks, setPlaylistTracks] = useState();
  const [showCross, setShowCross] = useState(-1);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (selectedPlaylist !== null) getPlaylistTracks();
  }, [selectedPlaylist, refreshSideBar, refresh]);

  const getPlaylistTracks = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/tracks/getPlaylistTracks`,
      { trackId: selectedPlaylist.id }
    );
    setPlaylistTracks(response.data.tracks);
  };

  const handlePlay = async (e) => {
    if (isloading === false) {
      setIsloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/tracks/get-track`,
        {
          name: e.track_name,
        },
        { responseType: "blob" }
      );
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      // Create a URL for the Blob
      const audioUrl = URL.createObjectURL(audioBlob);
      nowPlaying({
        img: e.album_img,
        name: e.track_name,
        artist: e.track_artist,
      });
      setAudio(new Audio(audioUrl));
      setIsloading(false);
    } else {
      toast.error("Please wait till your song loads");
    }
  };

  const removeFromPlaylist = async () => {
    if (showCross !== -1) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/tracks/removeFromPlaylist`,
          {
            playlistId: selectedPlaylist.id,
            trackId: playlistTracks[showCross].track_id,
          }
        );
        toast.success(response.data.message);
        setRefresh(!refresh);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="border border-slate-400 h-[95%]  w-[235px] bg-[#dfdfe1] rounded-xl p-3">
      <h1 className="text-xl text-center">
        {selectedPlaylist === null ? (
          "Favorites"
        ) : (
          <>
            <span className="underline">{selectedPlaylist?.name}</span> <br />
            <span className="text-sm ">by {selectedPlaylist?.author}</span>
          </>
        )}
      </h1>
      <div className="flex flex-col gap-3 px-1 py-2 h-[320px] rightSideBar overflow-y-auto">
        {playlistTracks?.length > 0 ? (
          playlistTracks?.map((e, i) => (
            <div
              key={i}
              onMouseEnter={() => setShowCross(i)}
              onMouseLeave={() => setShowCross(-1)}
              className="flex border relative items-center cursor-pointer border-slate-400 p-1 rounded-md gap-2"
            >
              {showCross === i ? (
                <div
                  className="absolute left-[187px] bottom-[40px]"
                  onClick={removeFromPlaylist}
                >
                  <div>
                    <i className="fa-solid fa-circle-xmark text-lg text-green-500"></i>
                  </div>
                </div>
              ) : null}
              <img
                src={e.album_img}
                onClick={() => handlePlay(e)}
                className="h-12 rounded-md"
                alt=""
              />
              <div className="flex flex-col items-start justify-center">
                <p className="leading-[20px] w-[140px] truncate text-xl">
                  {e.track_name}
                </p>
                <p className="text-sm truncate w-[140px]">{e.track_artist}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No Tracks in this Playlist </p>
        )}
      </div>
    </div>
  );
}
