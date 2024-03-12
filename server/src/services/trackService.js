// trackService.js

const { google } = require("googleapis");
const path = require("path");
const { createReadStream } = require("fs");
const credentials = require("../../config/credentials.json");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Function to upload a file to Google Drive
async function uploadToDrive(filePath) {
  try {
    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      SCOPES
    );
    await jwtClient.authorize();

    const drive = google.drive({ version: "v3", auth: jwtClient });

    const file = await drive.files.create({
      media: {
        body: createReadStream(filePath),
      },
      fields: "id",
      requestBody: {
        name: path.basename(filePath),
      },
    });

    console.log(`File uploaded to Google Drive. File ID: ${file.data.id}`);
    return file.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error.message);
  }
}

// Function to get audio stream from YouTube and upload to Google Drive
async function getAudioFromYTDL(name, artist, year) {
  try {
    // Include the release date in the search query
    const searchQuery = `${name} ${artist} ${year} audio lyrical`;

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

      // Return the audio stream instead of uploading to Google Drive
      return createReadStream(`./audio/audio.mp3`);
    } else {
      console.log("No search results found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function getAudioFromDrive(fileId) {
  try {
    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      SCOPES
    );
    await jwtClient.authorize();

    const drive = google.drive({ version: "v3", auth: jwtClient });

    // Get the file metadata
    const fileData = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    // Convert the file data to a buffer
    return fileData.data;
  } catch (error) {
    console.error("Error getting audio from Google Drive:", error.message);
    throw error;
  }
}

module.exports = {
  getAudioFromYTDL,
  uploadToDrive,
  getAudioFromDrive,
};
