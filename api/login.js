export default function handler(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;

  const scope = 'playlist-modify-public playlist-modify-private';

  const url =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      show_dialog: 'true',
    });

  res.redirect(url);
}