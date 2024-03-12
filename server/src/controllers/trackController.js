// trackController.js
const jwtUtils = require("../utils/jwtUtils");
const trackService = require("../services/trackService");
const supabase = require("../../config/supabase");

const getTrack = async (req, res) => {
  const { name, artist, year, img } = req.body;

  const { data: track, error: trackErr } = await supabase
    .from("tracks")
    .select("*")
    .eq("track_name", name);

  if (trackErr) {
    console.log(trackErr);
    throw new Error("internal server error");
  }

  if (track.length < 1) {
    //Get audio stream from YouTube
    const audioStream = await trackService.getAudioFromYTDL(name, artist, year);

    // Stream audio to the client
    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);

    // Upload to Google Drive and get the file ID
    const fileId = await trackService.uploadToDrive("./audio/audio.mp3");

    // Save file ID to Supabase or perform other operations
    const { data, error } = await supabase
      .from("tracks")
      .insert([
        {
          track_name: name,
          track_artist: artist,
          album_img: img,
          track_file: fileId,
          release_year: year,
        },
      ])
      .select();

    if (error) {
      console.log(error);
    }
  } else {
    console.log("track already exists");
    try {
      const audioData = await trackService.getAudioFromDrive(
        track[0].track_file
      );
      // const audioBlob = new Blob([audioData], { type: "audio/mp3" });
      console.log("sending blob");
      res.setHeader("Content-Type", "audio/mpeg");

      // Pipe the audio stream to the response
      audioData.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error getting audio from Google Drive" });
    }
  }
};

const updateLastPlayed = async (req, res) => {
  const { token, name } = req.body;
  const { userId } = jwtUtils.verifyToken(token);

  const { data: track, error: trackErr } = await supabase
    .from("tracks")
    .select("track_id")
    .eq("track_name", name);
  if (trackErr) {
    console.log(trackErr);
  }
  if (track.length > 0) {
    const { data: upsert, error: upsErr } = await supabase
      .from("last_played")
      .upsert(
        {
          user_id: userId,
          track_id: track[0].track_id,
        },
        { onConflict: "user_id" }
      )
      .select();

    if (upsErr) {
      console.log(upsErr);
    }
  }
};

const getPlaylistTracks = async (req, res) => {
  const { trackId } = req.body;

  try {
    const { data: playlistTracks, error: playlistTracksError } = await supabase
      .from("playlist_tracks")
      .select("track_id")
      .eq("playlist_id", trackId);

    if (playlistTracksError) {
      console.error(playlistTracksError);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (playlistTracks.length > 0) {
        const trackIds = playlistTracks.map((e) => e.track_id);
        // console.log(playlistTracks);

        const { data: tracks, error: tracksError } = await supabase
          .from("tracks")
          .select("*")
          .in("track_id", trackIds);

        if (tracksError) {
          console.error(tracksError);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(200).json({ tracks });
        }
      } else {
        res.json({ tracks: [] });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTrackToPlaylist = async (req, res) => {
  const { playlistId, track_name } = req.body;

  const { data, error } = await supabase
    .from("tracks")
    .select("track_id")
    .eq("track_name", track_name);
  if (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  if (data.length < 1) {
    res.json({
      message:
        "The song is currently not with us. Please play the song once and wait for it complete and then add it to your playlist",
    });
    return;
  }

  const { data: check, error: checkErr } = await supabase
    .from("playlist_tracks")
    .select("*")
    .eq("playlist_id", playlistId)
    .eq("track_id", data[0].track_id);

  if (checkErr) {
    console.log(inseredErr);
    res.status(500).json({ error: "Internal Server Error" });
  }

  if (check.length > 0) {
    res.json({ message: "Track already exists in the playlist" });
    return;
  }

  const { data: inserted, error: inseredErr } = await supabase
    .from("playlist_tracks")
    .insert([{ playlist_id: playlistId, track_id: data[0].track_id }]);

  if (inseredErr) {
    console.log(inseredErr);
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    res.json({ message: "Successfully added to playlist" });
  }
};

const removeFromPlaylist = async (req, res) => {
  const { playlistId, trackId } = req.body;

  const { data, error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);

  if (error) {
    console.log(inseredErr);
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    res.json({ message: "Successfully deleted from playlist" });
  }
};

module.exports = {
  getTrack,
  addTrackToPlaylist,
  getPlaylistTracks,
  updateLastPlayed,
  removeFromPlaylist,
};
