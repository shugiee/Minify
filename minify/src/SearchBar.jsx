import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = props => {
  const { query, handleQueryChange } = props;

  if (props.isSearchBarVisible) {
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
  } else {
    return <div className="hidden"></div>;
  }
};

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
};

export default SearchBar;
