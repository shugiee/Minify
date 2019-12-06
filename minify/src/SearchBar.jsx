import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = props => {
  if (props.isSearchBarVisible) {
    return (
      <div className="search-bar-container">
        <input
          type="text"
          id="search-bar"
          value={props.query}
          onChange={props.handleQueryChange}
          placeholder="Search for a song"
          autoFocus
        />
      </div>
    );
  } else {
    return <div className="hidden"></div>;
  }
};

export default SearchBar;
