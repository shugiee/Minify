import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SearchResultAlbum = props => {
  const {
    album,
    playAlbum,
    toggleSearchVisibility,
    isSearchBarVisible,
  } = props;
  if (isSearchBarVisible) {
    return (
      <div
        className="search-result-container"
        onClick={() => {
          playAlbum(album);
          toggleSearchVisibility();
        }}
      >
        <img
          src={album.images[2].url}
          className="card-img search-image"
          alt="Seach result album artwork"
        />
        <p className="search-information-song-name">{album.name}</p>
        <p className="search-information-artist-name">
          {album.artists
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

SearchResultAlbum.propTypes = {
  album: PropTypes.object.isRequired,
  playAlbum: PropTypes.func.isRequired,
  toggleSearchVisibility: PropTypes.func.isRequired,
  isSearchBarVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultAlbum);
