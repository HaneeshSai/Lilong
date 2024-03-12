import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Playlists from "../components/PlayLists";
import PlayBackPlayer from "../components/PlayBackPlayer";
import SearchResults from "../components/SearchResults";
import { Collapse } from "@mui/material";
import axios from "axios";
import NextInQue from "../components/NextInQue";
import RightSideBar from "../components/RightSideBar";
import data from "../data.json";

export default function DashBoard({ setIsloading, isloading }) {
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState();
  const [queName, setQueName] = useState("Next in Queue");
  const [popularTracks, setPopularTracks] = useState();
  const [lastPlayed, setLastPlayed] = useState();
  const [audio, setAudio] = useState();
  const [nowPlaying, setNowPlaying] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState();
  const [refreshSideBar, setRefreshSideBar] = useState(false);

  useEffect(() => {
    if (searchInput.trim() !== "" && searchInput.length > 2) {
      setQueName("Search Results");
      search();
    } else {
      setResults([]);
      setQueName("Next in Queue");
    }
  }, [searchInput]);

  const GetPopularTracks = async () => {
    if (localStorage.getItem("popularTracks")) {
      setPopularTracks(JSON.parse(localStorage.getItem("popularTracks")));
    } else {
      try {
        const Popular = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/spotify/popularTracks`
        );
        setPopularTracks(Popular.data.items);
        localStorage.setItem(
          "popularTracks",
          JSON.stringify(Popular.data.items)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    GetPopularTracks();
  }, []);

  const search = async (e) => {
    e?.preventDefault();
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/spotify/search?query=${searchInput}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="px-10 py-5 font-josef">
      <div className="flex justify-between mb-6">
        <div className="flex items-center cursor-pointer gap-6 text-xl font-semibold">
          <img
            className="h-14 rounded-full"
            src={data.pfps[Number(Cookies.get("name").split("-")[1])]}
            alt=""
          />
          <h1>{Cookies.get("name").split("-")[0]}</h1>
        </div>
        <div className="my-5">
          <div className="flex items-center">
            <input
              className="w-96 px-1 py-0.5 rounded-md outline-none border border-slate-400"
              type="text"
              placeholder="Search for your song here"
              onChange={(e) => {
                setSearchInput(e.target.value);
                e.target.value.length > 3
                  ? setSearching(true)
                  : setSearching(false);
              }}
            />
            <i className="fa-solid fa-magnifying-glass -ml-6"></i>
          </div>
        </div>
        <div className="my-5 w-[500px]">
          <div className="flex justify-around whitespace-nowrap">
            <button className="px-2 py-1 hover:bg-green-500 bg-green-600 rounded-md">
              START PARTY
            </button>
            <button className="px-2 py-1 hover:bg-green-500 bg-green-600 rounded-md">
              JOIN PARTY
            </button>
            <button>FAVORITES</button>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div>
          <div>
            <NextInQue
              header={queName}
              tracks={results?.tracks?.items}
              mostPopular={popularTracks}
              setAudio={setAudio}
              nowPlaying={setNowPlaying}
              userPlaylists={userPlaylists}
              setRefreshSideBar={setRefreshSideBar}
            />
          </div>
          <div>
            <Playlists
              setLastPlayed={setNowPlaying}
              setSelectedPlaylist={setSelectedPlaylist}
              setUserPlaylists={setUserPlaylists}
              userPlaylists={userPlaylists}
            />
          </div>
        </div>
        <div>
          <RightSideBar
            selectedPlaylist={selectedPlaylist}
            refreshSideBar={refreshSideBar}
            setAudio={setAudio}
            nowPlaying={setNowPlaying}
            setIsloading={setIsloading}
            isloading={isloading}
          />
        </div>
      </div>
      <div>
        <PlayBackPlayer track={lastPlayed} audio={audio} e={nowPlaying} />
      </div>
    </div>
  );
}
