import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SearchResultPlaylist = props => {
  const {
    playlist,
    playPlaylist,
    toggleSearchVisibility,
    isSearchBarVisible,
  } = props;
  if (isSearchBarVisible) {
    return (
      <div
        className="search-result-container"
        onClick={() => {
          playPlaylist(playlist);
          toggleSearchVisibility();
        }}
      >
        <img
          src={playlist.images[0] ? playlist.images[0].url : ''}
          className="card-img search-image"
          alt="Seach result album artwork"
        />
        <p className="search-information-song-name">{playlist.name}</p>
        <p className="search-information-artist-name">
          {playlist.owner.display_name}
        </p>
      </div>
    );
  }
  return <div className="hidden" />;
};

SearchResultPlaylist.propTypes = {
  playlist: PropTypes.object.isRequired,
  playPlaylist: PropTypes.func.isRequired,
  toggleSearchVisibility: PropTypes.func.isRequired,
  isSearchBarVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResultPlaylist);
