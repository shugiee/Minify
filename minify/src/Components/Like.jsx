import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLike } from '../redux/actions/likeActions';

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

const mapStateToProps = state => ({
  playState: state.like.playState,
  access_token: state.like.access_token,
  likesCurrentSong: state.like.likesCurrentSong,
});

const mapDispatchToProps = {
  toggleLike,
};

export default connect(mapStateToProps, mapDispatchToProps)(Like);
