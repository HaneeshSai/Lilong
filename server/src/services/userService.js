// userService.js
const supabase = require("../../config/supabase");
const jwtUtils = require("../utils/jwtUtils");

const getUsersPlaylists = async (token) => {
  try {
    const { userId } = jwtUtils.verifyToken(token);

    // Get user playlists
    const { data: userPlaylistsData, error: userPlaylistsError } =
      await supabase
        .from("user_playlists")
        .select("playlist_id")
        .eq("user_id", userId);

    if (userPlaylistsError) {
      console.error("Error retrieving user playlists:", userPlaylistsError);
      throw new Error("Internal Server Error");
    }

    const playlistIds = userPlaylistsData.map((row) => row.playlist_id);

    // Get playlists based on playlistIds
    const { data: playlists, error } = await supabase
      .from("playlists")
      .select("*")
      .in("playlist_id", playlistIds);

    if (error) {
      console.error("Error retrieving playlists:", error);
      throw new Error("Internal Server Error");
    }

    // Get the last played trackId
    const { data: lastPlayedData, error: lastplayedError } = await supabase
      .from("last_played")
      .select("track_id")
      .eq("user_id", userId);

    if (lastplayedError) {
      console.error("Error retrieving last played trackId:", lastplayedError);
      throw new Error("Internal Server Error");
    }

    const trackId = lastPlayedData[0]?.track_id;

    // Set lastTrack to an empty string if trackId is not available
    const lastTrack = trackId
      ? await supabase.from("tracks").select("*").eq("track_id", trackId)
      : "";

    return { playlists, lastTrack };
  } catch (e) {
    console.error("Unexpected error:", e);
    throw new Error("Internal Server Error");
  }
};

const createPlaylist = async (token, name, author) => {
  try {
    const { userId } = jwtUtils.verifyToken(token);

    const { data: img, error: imgErr } = await supabase
      .from("profiles")
      .select("profile_pic")
      .eq("id", userId);

    if (imgErr) {
      console.error("Error retrieving last played trackId:", imgErr);
      throw new Error("Internal Server Error");
    }

    const { data, error: plErr } = await supabase
      .from("playlists")
      .insert([
        {
          playlist_name: name,
          user_id: userId,
          playlist_img: img[0].profile_pic,
          user_name: author,
        },
      ])
      .select();

    if (plErr) {
      console.error(plErr);
      throw new Error("Internal Server Error");
    }

    const { data: userPlaylists, error } = await supabase
      .from("user_playlists")
      .insert([
        {
          playlist_id: data[0].playlist_id,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      throw new Error("Internal Server Error");
    }
    return "Succesfully created Playlist";
  } catch (error) {
    console.error("Unexpected error:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  getUsersPlaylists,
  createPlaylist,
};
