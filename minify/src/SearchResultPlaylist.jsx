import React from 'react';

// TODO FINISH

const SearchResultPlaylist = props => {
  const {
    playlist,
    playPlaylist,
    toggleSearchVisibility,
    showSearchBar,
  } = props;
  if (showSearchBar) {
    return (
      <div
        className='search-result-container'
        onClick={() => {
          playPlaylist(playlist, 'searchResult');
          toggleSearchVisibility();
        }}
      >
        <img
          src={playlist.images[0] ? playlist.images[0].url : ''}
          className='card-img search-image'
          alt='Seach result album artwork'
        />
        <p className='search-information-song-name'>{playlist.name}</p>
        <p className='search-information-artist-name'>
          {playlist.owner.display_name}
        </p>
      </div>
    );
  }
  return <div className='hidden' />;
};

export default SearchResultPlaylist;
