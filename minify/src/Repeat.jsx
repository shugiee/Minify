import React from 'react';
import PropTypes from 'prop-types';

const Repeat = props => {
  const { repeat_state, toggleRepeat } = props;
  if (repeat_state === 'off' || !repeat_state) {
    return (
      <div className="repeat-container d-flex align-items-center justify-content-center">
        <span id="repeat" className="icon" onClick={toggleRepeat}></span>
      </div>
    );
  } 
    return (
      <div className="repeat-container d-flex align-items-center justify-content-center">
        <span
          id="repeat"
          className="icon filter-green"
          onClick={toggleRepeat}
        ></span>
      </div>
    );
  
};

Repeat.propTypes = {
  repeat_state: PropTypes.string.isRequired,
  toggleRepeat: PropTypes.func.isRequired,
};

export default Repeat;
