import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PlayPause = props => {
  const { is_playing, resume, pause } = props;

  if (is_playing) {
    return (
      <div
        className="pause-container d-flex align-items-center justify-content-center"
        onClick={pause}
      >
        <span id="pause" className="icon" />
      </div>
    );
  }
  return (
    <div
      className="resume-container d-flex align-items-center justify-content-center"
      onClick={resume}
    >
      <span id="resume" className="icon" />
    </div>
  );
};

PlayPause.propTypes = {
  is_playing: PropTypes.bool.isRequired,
  resume: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlayPause);
