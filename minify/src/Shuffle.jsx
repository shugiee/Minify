import React from 'react';

const Shuffle = props => {
  if (props.shuffle_state) {
    return (
      <div className="shuffle-container d-flex align-items-center justify-content-center">
        <span
          id="shuffle"
          className="icon filter-green"
          onClick={props.toggleShuffle}
        ></span>
      </div>
    );
  } 
    return (
      <div className="shuffle-container d-flex align-items-center justify-content-center">
        <span
          id="shuffle"
          className="icon"
          onClick={props.toggleShuffle}
        ></span>
      </div>
    );
  
};

export default Shuffle;
