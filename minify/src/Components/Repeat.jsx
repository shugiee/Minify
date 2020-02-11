import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Repeat = props => {
  const { repeat_state, toggleRepeat } = props;
  if (repeat_state === 'off' || !repeat_state) {
    return (
      <div className="repeat-container d-flex align-items-center justify-content-center">
        <span id="repeat" className="icon" onClick={toggleRepeat} />
      </div>
    );
  }
  return (
    <div className="repeat-container d-flex align-items-center justify-content-center">
      <span id="repeat" className="icon filter-green" onClick={toggleRepeat} />
    </div>
  );
};

Repeat.propTypes = {
  repeat_state: PropTypes.string.isRequired,
  toggleRepeat: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Repeat);
