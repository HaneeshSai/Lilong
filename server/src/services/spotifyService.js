const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let accessToken = null;
let accessTokenExpirationTime = 0;

// Retrieve or refresh the access token
async function getAccessToken() {
  try {
    if (Date.now() > accessTokenExpirationTime) {
      // Token is expired or not set, refresh it
      const data = await spotifyApi.clientCredentialsGrant();
      accessToken = data.body.access_token;
      // Set expiration time to one hour from now
      accessTokenExpirationTime = Date.now() + data.body.expires_in * 1000;
    }
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Internal Server Error");
  }
}

// Set the access token for the Spotify API instance
async function setAccessToken() {
  try {
    const token = await getAccessToken();
    spotifyApi.setAccessToken(token);
  } catch (error) {
    console.error("Error setting access token:", error);
    throw new Error("Internal Server Error");
  }
}

// Search for tracks with authentication
async function searchTracks(query) {
  try {
    // Set the access token before making the request
    await setAccessToken();

    const response = await spotifyApi.searchTracks(query);
    return response.body;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw new Error("Internal Server Error");
  }
}

// Get most popular or trending tracks
async function getMostPopularTracks() {
  try {
    // Set the access token before making the request
    await setAccessToken();

    const response = await spotifyApi.getFeaturedPlaylists({
      limit: 1, // Limit to 1 playlist for simplicity
    });

    const playlistId = response.body.playlists.items[0].id;
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, {
      limit: 20,
    });

    return playlistTracks.body;
  } catch (error) {
    console.error("Error getting most popular tracks:", error);
    throw new Error("Internal Server Error");
  }
}

module.exports = {
  searchTracks,
  getMostPopularTracks,
};
