import React from 'react';

// TODO FINISH

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const SearchResultArtist = props => {
  const { artist, playArtist, toggleSearchVisibility, showSearchBar } = props;
  if (showSearchBar) {
    return (
      <div
        className='search-result-container'
        onClick={() => {
          playArtist(artist, 'searchResult');
          toggleSearchVisibility();
        }}
      >
        <img
          src={artist.images[2].url}
          className='card-img search-image'
          alt='Seach result album artwork'
        />
        <p className='search-information-song-name'>{artist.name}</p>
        <p className='search-information-artist-name'>
          {toTitleCase(artist.genres[0] || '')}
        </p>
      </div>
    );
  }
  return <div className='hidden' />;
};

export default SearchResultArtist;
