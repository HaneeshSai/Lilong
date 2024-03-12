const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/playlists", userController.getUsersPlaylists);
router.post("/createPlaylist", userController.createPlaylist);

module.exports = router;
