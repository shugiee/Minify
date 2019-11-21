import React from 'react';

const SearchResult = props => {
  const { song, playSong, showSearchBar } = props;
  if (props.showSearchBar) {
    return (
      <div className='search-result'>
        <a
          onClick={() => {
            props.playSong(song, 'searchResult');
          }}
        >
          Song Name: {song.name}
        </a>
        <p>
          Artist:{' '}
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
