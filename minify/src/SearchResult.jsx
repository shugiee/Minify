import React from 'react';

const SearchResult = props => {
  const { song, playSong, showSearchBar } = props;
  if (props.showSearchBar) {
    return (
      <div
        className='search-result-container'
        onClick={() => {
          props.playSong(song, 'searchResult');
        }}
      >
        <div className='search-image-container d-flex align-items-center justify-content-center'>
          <img
            src={song.album.images[2].url}
            className='card-img search-image'
            alt='Seach result album artwork'
          />
        </div>
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
  } else {
    return <div className='hidden'></div>;
  }
};

export default SearchResult;
