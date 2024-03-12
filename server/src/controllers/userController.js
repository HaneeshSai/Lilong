// userController.js
const userService = require("../services/userService");

const getUsersPlaylists = async (req, res) => {
  try {
    const { token } = req.body;
    const { playlists, lastTrack } = await userService.getUsersPlaylists(token);

    return res.status(200).json({ playlists, lastTrack });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { token, name, author } = req.body;
    const response = await userService.createPlaylist(token, name, author);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getUsersPlaylists,
  createPlaylist,
};
