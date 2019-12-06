import React from 'react';
import PropTypes from 'prop-types';

const Like = props => {
  if (props.likesCurrentSong) {
    return (
      <div className="like-container d-flex align-items-center justify-content-center">
        <span
          id="like-true"
          className="icon filter-green"
          onClick={props.toggleLike}
        />
      </div>
    );
  }
  return (
    <div className="like-container d-flex align-items-center justify-content-center">
      <span id="like-false" className="icon" onClick={props.toggleLike} />
    </div>
  );
};

Like.protoTypes = {
  likesCurrentSong: PropTypes.Boolean,
  toggleLike: PropTypes.Function,
};

export default Like;
