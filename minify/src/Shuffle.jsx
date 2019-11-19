import React from 'react';

const Shuffle = props => {
  if (props.shuffle_state) {
    return (
      <div className='shuffle-container d-flex align-items-center justify-content-center'>
        <span id='shuffle' className='icon filter-green'></span>
      </div>
    );
  } else {
    return (
      <div className='shuffle-container d-flex align-items-center justify-content-center'>
        <span id='shuffle' className='icon'></span>
      </div>
    );
  }
};

export default Shuffle;
