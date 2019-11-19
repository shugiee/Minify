import React from 'react';

const Repeat = props => {
  if (props.repeat_state === 'off') {
    return (
      <div className='repeat-container d-flex align-items-center justify-content-center'>
        <span id='repeat' className='icon'></span>
      </div>
    );
  } else {
    return (
      <div className='repeat-container d-flex align-items-center justify-content-center'>
        <span id='repeat' className='icon filter-green'></span>
      </div>
    );
  }
};

export default Repeat;
