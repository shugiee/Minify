import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLike } from '../redux/actions/likeActions';

const Like = props => {
  const { likesCurrentSong, playState, access_token, refresh_token } = props;
  const classes = likesCurrentSong ? 'icon filter-green' : 'icon filter-white';

  return (
    <div className="like-container d-flex align-items-center justify-content-center">
      <span
        id={`like-${likesCurrentSong}`}
        className={classes}
        onClick={() => {
          props.toggleLike(
            playState,
            likesCurrentSong,
            access_token,
            refresh_token
          );
        }}
      />
    </div>
  );
};

Like.propTypes = {
  likesCurrentSong: PropTypes.bool.isRequired,
  toggleLike: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  playState: state.playState,
  likesCurrentSong: state.like.likesCurrentSong,
  access_token: state.access_token,
  refresh_token: state.refresh_token,
});

const mapDispatchToProps = {
  toggleLike,
};

export default connect(mapStateToProps, mapDispatchToProps)(Like);
