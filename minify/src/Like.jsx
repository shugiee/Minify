import React from 'react';

const Like = props => {
  if (props.likesCurrentSong) {
    return (
      <div className='like-container d-flex align-items-center justify-content-center'>
        <span
          id='like-true'
          className='icon filter-green'
          onClick={props.toggleLike}
        ></span>
      </div>
    );
  } else {
    return (
      <div className='like-container d-flex align-items-center justify-content-center'>
        <span
          id='like-false'
          className='icon'
          onClick={props.toggleLike}
        ></span>
      </div>
    );
  }
};

export default Like;
