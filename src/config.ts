import 'dotenv/config';
import nconf from 'nconf';

const configs = {
  default: {
    server: {
      port: 4000,
    },
    spotify: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectURI: process.env.REDIRECT_URI,
      refreshToken: process.env.REFRESH_TOKEN,
      deviceName: process.env.DEVICE_NAME,
      playListName: process.env.PLAYLIST_NAME,
      endPoints: {
        getToken: 'https://accounts.spotify.com/api/token',
        devices: 'https://api.spotify.com/v1/me/player/devices',
        transferPlayback: 'https://api.spotify.com/v1/me/player',
        getPlayLists: 'https://api.spotify.com/v1/me/playlists',
        playPlayList: 'https://api.spotify.com/v1/me/player/play',
      },
    },
  },
};

nconf
  .argv()
  .env()
  .use('literal', configs[nconf.get('NODE_ENV') as keyof typeof configs] || {})
  .defaults(configs.default);

export const getConfig = (): typeof configs.default => {
  return nconf.get();
};
