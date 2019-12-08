import React from 'react';
import PropTypes from 'prop-types';

const Like = props => {
  const { likesCurrentSong } = props;

  const classes = likesCurrentSong ? 'icon filter-green' : 'icon filter-white';

  return (
    <div className="like-container d-flex align-items-center justify-content-center">
      <span
        id={`like-${likesCurrentSong}`}
        className={classes}
        onClick={props.toggleLike}
      />
    </div>
  );
};

Like.propTypes = {
  likesCurrentSong: PropTypes.bool.isRequired,
  toggleLike: PropTypes.func.isRequired,
};

export default Like;
