import React from 'react';
import SearchResultTrack from './SearchResultTrack.jsx';
import SearchResultAlbum from './SearchResultAlbum.jsx';
import SearchResultArtist from './SearchResultArtist.jsx';
import SearchResultPlaylist from './SearchResultPlaylist.jsx';

// TODO FINISH

const SearchResultAll = props => {
  const { queryResults, showSearchBar } = props;
  return (
    <div className='search-results-container-outer'>
      {showSearchBar && queryResults.tracks.items.length ? (
        <p className='search-results-group'>Tracks</p>
      ) : null}
      {queryResults.tracks.items.map(song => {
        return (
          <SearchResultTrack
            song={song}
            playSong={props.playSong}
            toggleSearchVisibility={props.toggleSearchVisibility}
            showSearchBar={showSearchBar}
            key={song.id}
          />
        );
      })}
      {showSearchBar && queryResults.albums.items.length ? (
        <p className='search-results-group'>Albums</p>
      ) : null}
      {queryResults.albums.items.map(album => {
        return (
          <SearchResultAlbum
            album={album}
            playAlbum={props.playAlbum}
            toggleSearchVisibility={props.toggleSearchVisibility}
            showSearchBar={showSearchBar}
            key={album.id}
          />
        );
      })}
      {showSearchBar && queryResults.artists.items.length ? (
        <p className='search-results-group'>Artists</p>
      ) : null}
      {queryResults.artists.items.map(artist => {
        return (
          <SearchResultArtist
            artist={artist}
            playArtist={props.playArtist}
            toggleSearchVisibility={props.toggleSearchVisibility}
            showSearchBar={showSearchBar}
            key={artist.id}
          />
        );
      })}
      {showSearchBar && queryResults.playlists.items.length ? (
        <p className='search-results-group'>Playlists</p>
      ) : null}
      {queryResults.playlists.items.map(playlist => {
        return (
          <SearchResultPlaylist
            playlist={playlist}
            playPlaylist={props.playPlaylist}
            toggleSearchVisibility={props.toggleSearchVisibility}
            showSearchBar={showSearchBar}
            key={playlist.id}
          />
        );
      })}
    </div>
  );
  // return <div />;
};

export default SearchResultAll;
