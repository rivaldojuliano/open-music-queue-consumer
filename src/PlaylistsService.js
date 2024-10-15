const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const queryGetPlaylist = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [playlistId]
    };

    const playlistResult = await this._pool.query(queryGetPlaylist);

    const queryGetSong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId]
    };

    const songResult = await this._pool.query(queryGetSong);

    const playlist = playlistResult.rows[0];

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        username: playlist.username,
        songs: songResult.rows
      }
    };
  }
}

module.exports = PlaylistsService;