import React from 'react';

const SearchResult = props => {
  if (props.showSearchBar) {
    return (
      <div className='search-result'>
        <a
          onClick={() => {
            props.playSong(props.result.album.uri, props.result.track_number);
          }}
        >
          Song Name: {props.result.name}
        </a>
        <p>
          Artist:{' '}
          {props.result.artists
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
