import React from 'react';

const SearchResultTracks = props => {
  const { song, playSong, toggleSearchVisibility, showSearchBar } = props;
  if (showSearchBar) {
    return (
      <div
        className='search-result-container'
        onClick={() => {
          playSong(song, 'searchResult');
          toggleSearchVisibility();
        }}
      >
        <img
          src={song.album.images[2].url}
          className='card-img search-image'
          alt='Seach result album artwork'
        />
        <p className='search-information-song-name'>{song.name}</p>
        <p className='search-information-artist-name'>
          {song.artists
            .map(artist => {
              return artist.name;
            })
            .join(' & ')}
        </p>
      </div>
    );
  }
  return <div className='hidden' />;
};

export default SearchResultTracks;
