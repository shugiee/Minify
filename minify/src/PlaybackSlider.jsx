import React from 'react';

const PlaybackSlider = props => {
  // console.log(props.progress_ms, props.duration_ms);
  return (
    <div className='playback-slider-container'>
      <input
        type='range'
        value={props.progress_ms}
        onChange={event => {
          console.log(props.progress_ms);
          props.handleSliderChange(event);
        }}
        onClick={event => {
          props.handleSliderClick(event);
        }}
        min='0'
        max={JSON.stringify(props.duration_ms) || '0'}
        id='playback-slider'
        style={{
          background: `linear-gradient(
                      90deg,
                      #ffffff ${(props.progress_ms / props.duration_ms) * 100}%,
                      #666666 0%)`
        }}
      />
    </div>
  );
};

export default PlaybackSlider;
