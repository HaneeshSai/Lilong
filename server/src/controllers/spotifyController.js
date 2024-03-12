const spotifyService = require("../services/spotifyService");

async function searchTracks(req, res) {
  const { query } = req.query;

  try {
    const tracks = await spotifyService.searchTracks(query);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPopularTracks(req, res) {
  try {
    const tracks = await spotifyService.getMostPopularTracks();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  searchTracks,
  getPopularTracks,
};
