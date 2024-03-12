import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function TrackImg({
  e,
  setAudio,
  nowPlaying,
  userPlaylists,
  setRefreshSideBar,
}) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handlePlay = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/tracks/get-track`,
      {
        name: e.track.name,
        artist: e.track.artists[0].name,
        year: e.track.album.release_date,
        img: e.track.album.images[0].url,
      },
      { responseType: "blob" }
    );
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });

    // Create a URL for the Blob
    const audioUrl = URL.createObjectURL(audioBlob);
    nowPlaying({
      img: e.track.album.images[0].url,
      name: e.track.name,
      artist: e.track.artists[0].name,
    });
    setAudio(new Audio(audioUrl));
  };

  const createPlaylist = async (playlist) => {
    //console.log(playlist.playlist_id, e.track.name);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/tracks/addTracktoPlaylist`,
        { playlistId: playlist.playlist_id, track_name: e.track.name }
      );
      toast(response.data.message);
    } catch (error) {
      console.log(error);
    }
    setRefresh(!refresh);
    setRefreshSideBar(!refresh);
  };

  return (
    <div
      className="pr-2 cursor-pointer border-r border-slate-400"
      onMouseEnter={() => setShowContextMenu(true)}
      onMouseLeave={() => setShowContextMenu(false)}
    >
      <img
        src={e.track.album.images[0].url}
        className="h-32 rounded-md"
        alt=""
      />
      {showPlaylists ? (
        <div
          onMouseEnter={() => setShowPlaylists(true)}
          onMouseLeave={() => setShowPlaylists(false)}
          className="bg-green-600 w-32  rounded-md z-20 absolute bottom-14 left-10"
        >
          {userPlaylists?.length > 0 ? (
            userPlaylists.map((e, i) => (
              <div
                key={i}
                className="hover:bg-green-400 rounded-md py-0.5 px-1"
              >
                {e.user_name === Cookies.get("name").split("-")[0] ? (
                  <p
                    onClick={() => createPlaylist(e)}
                    className="truncate cursor-pointer"
                  >
                    add to {e.playlist_name}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <p>No Playlists</p>
          )}
        </div>
      ) : null}
      {showContextMenu ? (
        <div className="absolute top-24 flex justify-between w-[88%] px-2">
          <div
            onMouseEnter={() => setShowPlaylists(true)}
            onMouseLeave={() => setShowPlaylists(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-green-600"
          >
            <i className="fa-solid fa-plus"></i>
          </div>
          <div
            onClick={handlePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-green-600"
          >
            <i className="relative left-[1px] text-lg top-0.5  fa-solid fa-play"></i>
          </div>
        </div>
      ) : null}

      <p className="text-lg mt-1 truncate">{e.track?.name}</p>
      <p className="text-sm truncate">by {e.track.artists[0].name}</p>
    </div>
  );
}
