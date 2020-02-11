import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SearchResultTracks = props => {
  const { song, playSong, toggleSearchVisibility, isSearchBarVisible } = props;
  if (isSearchBarVisible) {
    return (
      <div
        className="search-result-container"
        onClick={() => {
          playSong(song, 'searchResult');
          toggleSearchVisibility();
        }}
      >
        <img
          src={song.album.images[2].url}
          className="card-img search-image"
          alt="Seach result album artwork"
        />
        <p className="search-information-song-name">{song.name}</p>
        <p className="search-information-artist-name">
          {song.artists
            .map(artist => {
              return artist.name;
            })
            .join(' & ')}
        </p>
      </div>
    );
  }
  return <div className="hidden" />;
};

SearchResultTracks.propTypes = {
  song: PropTypes.object.isRequired,
  playSong: PropTypes.func.isRequired,
  toggleSearchVisibility: PropTypes.func.isRequired,
  isSearchBarVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultTracks);
