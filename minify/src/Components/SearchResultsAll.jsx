import React from 'react';
import PropTypes from 'prop-types';
import SearchResultTrack from './SearchResultTrack.jsx';
import SearchResultAlbum from './SearchResultAlbum.jsx';
import SearchResultArtist from './SearchResultArtist.jsx';
import SearchResultPlaylist from './SearchResultPlaylist.jsx';

const SearchResultAll = props => {
  const {
    queryResults,
    isSearchBarVisible,
    toggleSearchVisibility,
    playSong,
    playAlbum,
    playArtist,
    playPlaylist,
  } = props;
  return (
    <div className="search-results-container-outer">
      {isSearchBarVisible && queryResults.tracks.items.length ? (
        <p className="search-results-group">Tracks</p>
      ) : null}
      {queryResults.tracks.items.map(song => {
        return (
          <SearchResultTrack
            song={song}
            playSong={playSong}
            toggleSearchVisibility={toggleSearchVisibility}
            isSearchBarVisible={isSearchBarVisible}
            key={song.id}
          />
        );
      })}
      {isSearchBarVisible && queryResults.albums.items.length ? (
        <p className="search-results-group">Albums</p>
      ) : null}
      {queryResults.albums.items.map(album => {
        return (
          <SearchResultAlbum
            album={album}
            playAlbum={playAlbum}
            toggleSearchVisibility={toggleSearchVisibility}
            isSearchBarVisible={isSearchBarVisible}
            key={album.id}
          />
        );
      })}
      {isSearchBarVisible && queryResults.artists.items.length ? (
        <p className="search-results-group">Artists</p>
      ) : null}
      {queryResults.artists.items.map(artist => {
        return (
          <SearchResultArtist
            artist={artist}
            playArtist={playArtist}
            toggleSearchVisibility={toggleSearchVisibility}
            isSearchBarVisible={isSearchBarVisible}
            key={artist.id}
          />
        );
      })}
      {isSearchBarVisible && queryResults.playlists.items.length ? (
        <p className="search-results-group">Playlists</p>
      ) : null}
      {queryResults.playlists.items.map(playlist => {
        return (
          <SearchResultPlaylist
            playlist={playlist}
            playPlaylist={playPlaylist}
            toggleSearchVisibility={toggleSearchVisibility}
            isSearchBarVisible={isSearchBarVisible}
            key={playlist.id}
          />
        );
      })}
    </div>
  );
};

SearchResultAll.propTypes = {
  queryResults: PropTypes.object.isRequired,
  isSearchBarVisible: PropTypes.func.isRequired,
  toggleSearchVisibility: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  playAlbum: PropTypes.func.isRequired,
  playArtist: PropTypes.func.isRequired,
  playPlaylist: PropTypes.func.isRequired,
};

export default SearchResultAll;
