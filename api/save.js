async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req, res) {
  try {
    const { track, artist } = req.body;

    const token = await getAccessToken();

    // Search track
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        track + " " + artist,
      )}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const searchData = await searchRes.json();
    const trackId = searchData?.tracks?.items?.[0]?.id;

    if (!trackId) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Save track
    await fetch("https://api.spotify.com/v1/me/tracks", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [trackId] }),
    });

    res.json({ success: true, trackId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
