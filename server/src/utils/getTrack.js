const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const uploadToDrive = require("./uploadToDrive");

ffmpeg.setFfmpegPath(ffmpegPath);

const getAudioFromYTDL = async (songName, artistName, releaseDate) => {
  try {
    // Include the release date in the search query
    const searchQuery = `${songName} ${artistName} ${releaseDate}`;

    // Search for the video on YouTube using ytsr
    const searchResults = await ytsr(searchQuery, { limit: 1 });

    if (
      searchResults &&
      searchResults.items &&
      searchResults.items.length > 0
    ) {
      const videoInfo = searchResults.items[0];

      // Get the video URL
      const videoURL = videoInfo.url;

      // Download the audio stream
      const audioStream = ytdl(videoURL, { filter: "audioonly" });

      // Convert the audio stream to a format of your choice (e.g., mp3)
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(audioStream)
          .audioCodec("libmp3lame")
          .on("end", () => {
            console.log("Conversion finished");
            resolve();
          })
          .on("error", (err) => {
            console.error("Error:", err);
            reject(err);
          })
          .save(`./audio/audio.mp3`);
      });

      // Upload to Google Drive and get the file ID
      const driveFileId = await uploadToDrive("./audio/audio.mp3");
      return driveFileId;
    } else {
      console.log("No search results found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Example usage
module.exports = getAudioFromYTDL;
