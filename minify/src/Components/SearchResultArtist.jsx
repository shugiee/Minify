import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const SearchResultArtist = props => {
  const {
    artist,
    playArtist,
    toggleSearchVisibility,
    isSearchBarVisible,
  } = props;
  const imagesLength = artist.images.length;
  let src;
  switch (imagesLength) {
    case 1:
      src = artist.images[0].url;
      break;
    case 2:
      src = artist.images[1].url;
      break;
    case 3:
      src = artist.images[2].url;
      break;
    default:
      src = '';
  }
  if (isSearchBarVisible) {
    return (
      <div
        className="search-result-container"
        onClick={() => {
          playArtist(artist);
          toggleSearchVisibility();
        }}
      >
        <img
          src={src}
          className="card-img search-image"
          alt="Seach result album artwork"
        />
        <p className="search-information-song-name">{artist.name}</p>
        <p className="search-information-artist-name">
          {toTitleCase(artist.genres[0] || '')}
        </p>
      </div>
    );
  }
  return <div className="hidden" />;
};

SearchResultArtist.propTypes = {
  artist: PropTypes.string.isRequired,
  playArtist: PropTypes.func.isRequired,
  toggleSearchVisibility: PropTypes.func.isRequired,
  isSearchBarVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultArtist);
