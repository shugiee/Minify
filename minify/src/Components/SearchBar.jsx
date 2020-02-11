import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SearchBar = props => {
  const { query, handleQueryChange, isSearchBarVisible } = props;

  if (isSearchBarVisible) {
    return (
      <div className="search-bar-container">
        <input
          type="text"
          id="search-bar"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search for a song"
          autoFocus
        />
      </div>
    );
  }
  return <div className="hidden" />;
};

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
  isSearchBarVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
