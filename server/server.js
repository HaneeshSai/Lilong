// src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const spotifyRoutes = require("./src/routes/spotifyRoutes");
const userRoutes = require("./src/routes/userRoutes");
const trackRoutes = require("./src/routes/trackRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/users", userRoutes);
app.use("/tracks", trackRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
