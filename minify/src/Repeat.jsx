import React from 'react';

const Repeat = props => {
  if (props.repeat_state === 'off' || !props.repeat_state) {
    return (
      <div className='repeat-container d-flex align-items-center justify-content-center'>
        <span id='repeat' className='icon' onClick={props.toggleRepeat}></span>
      </div>
    );
  } else {
    return (
      <div className='repeat-container d-flex align-items-center justify-content-center'>
        <span
          id='repeat'
          className='icon filter-green'
          onClick={props.toggleRepeat}
        ></span>
      </div>
    );
  }
};

export default Repeat;
