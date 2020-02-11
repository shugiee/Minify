/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PlaybackSlider = props => {
  const {
    progress_ms,
    duration_ms,
    handleSliderChange,
    handleSliderClick,
  } = props;

  return (
    <div className="playback-slider-container">
      <input
        type="range"
        value={progress_ms}
        onChange={event => {
          console.log(progress_ms);
          handleSliderChange(event);
        }}
        onClick={event => {
          handleSliderClick(event);
        }}
        min="0"
        max={JSON.stringify(duration_ms) || '0'}
        id="playback-slider"
        style={{
          background: `linear-gradient(
                      90deg,
                      #ffffff ${(progress_ms / duration_ms) * 100}%,
                      #666666 0%)`,
        }}
      />
    </div>
  );
};

PlaybackSlider.propTypes = {
  progress_ms: PropTypes.number.isRequired,
  duration_ms: PropTypes.number.isRequired,
  handleSliderChange: PropTypes.func.isRequired,
  handleSliderClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackSlider);
