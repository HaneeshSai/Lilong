const express = require("express");
const router = express.Router();
const trackController = require("../controllers/trackController");

router.post("/get-track", trackController.getTrack);
router.post("/update-lastPlayed", trackController.updateLastPlayed);
router.post("/getPlaylistTracks", trackController.getPlaylistTracks);
router.post("/addTracktoPlaylist", trackController.addTrackToPlaylist);
router.post("/removeFromPlaylist", trackController.removeFromPlaylist);

module.exports = router;
