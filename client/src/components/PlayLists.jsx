import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const members = [
  "Playlist 1",
  "Playlist 2",
  "Playlist 3",
  "Playlist 4",
  "Playlist 4",
  "Playlist 4",
];
import data from "../data.json";

export default function Playlists({
  setLastPlayed,
  setSelectedPlaylist,
  setUserPlaylists,
  userPlaylists,
}) {
  const [copyState, setCopyState] = useState("copy");
  const [playListname, setPlaylistname] = useState("");
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  useEffect(() => {
    getUsersPlaylists();
  }, [playlistCreated]);

  const getUsersPlaylists = async () => {
    try {
      const results = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/playlists`,
        {
          token: Cookies.get("token"),
        }
      );
      setUserPlaylists(results.data.playlists);
      // setLastPlayed(results.data.lastTrack);
      // getUsersPlaylists();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (playListname.length < 3) {
      toast.error("Playlist Name Should be atleast 3 characters");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/createPlaylist`,
        {
          name: playListname,
          token: Cookies.get("token"),
          author: Cookies.get("name").split("-")[0],
        }
      );
      toast.success(response.data);
      setPlaylistCreated(!playlistCreated);
      setPlaylistname("");
      setShowCreatePlaylist(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {showCreatePlaylist ? (
        <form
          onSubmit={handleCreatePlaylist}
          className="absolute bottom-0 flex flex-col items-center justify-center z-20 h-screen w-screen backdrop-blur-md"
        >
          <div className="border border-slate-500 py-4 px-2 rounded-sm bg-[#dfdfe1]">
            <h1>Create Your First Playlist</h1>
            <div className="flex gap-2">
              <p>Playlist Name:</p>
              <input
                type="text"
                value={playListname}
                onChange={(e) => setPlaylistname(e.target.value)}
                placeholder="Name of Your Playlist"
                className="px-1 py-0.5"
              />
            </div>
            <div className="mt-5">
              <button
                onClick={handleCreatePlaylist}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded-md mx-6"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setPlaylistname("");
                }}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded-md mx-6"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}
      <div className="my-6 border border-slate-400 rounded-xl p-3 bg-[#dfdfe1]">
        <div className="flex justify-between">
          <h1 className="text-xl underline leading-9">Playlists</h1>
          <div
            onClick={() => setShowCreatePlaylist(true)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <h1>Create a Playlist</h1>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {userPlaylists?.length < 1 ? (
            <form onSubmit={handleCreatePlaylist}>
              <h1>Create Your First Playlist</h1>
              <div className="flex gap-2">
                <p>Playlist Name:</p>
                <input
                  type="text"
                  value={playListname}
                  onChange={(e) => setPlaylistname(e.target.value)}
                  placeholder="Name of Your Playlist"
                  className="px-1 py-0.5"
                />
              </div>
              <button
                onClick={handleCreatePlaylist}
                className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded-md mx-6"
              >
                Create
              </button>
            </form>
          ) : (
            userPlaylists?.map((e, i) => (
              <div
                key={i}
                className="border hover:bg-[#f1f1f2] cursor-pointer flex items-center gap-4 border-slate-400 rounded-md p-2"
                onClick={() => {
                  setSelectedPlaylist({
                    name: e.playlist_name,
                    id: e.playlist_id,
                    author: e.user_name,
                  });
                }}
              >
                <img
                  src={data.pfps[e.playlist_img]}
                  alt=""
                  className="h-12 rounded-full"
                />
                <div className="">
                  <p className="text-lg leading-4">{e.playlist_name}</p>
                  <p className="text-sm">by {e.user_name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
