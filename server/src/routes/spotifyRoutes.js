const express = require("express");
const spotifyController = require("../controllers/spotifyController");

const router = express.Router();

router.get("/search", spotifyController.searchTracks);
router.get("/popularTracks", spotifyController.getPopularTracks);

module.exports = router;
