import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleShuffle } from '../redux/actions/shuffleAction';

const Shuffle = props => {
  const { shuffle_state, toggleShuffle, access_token, refresh_token } = props;

  if (shuffle_state) {
    return (
      <div className="shuffle-container d-flex align-items-center justify-content-center">
        <span
          id="shuffle"
          className="icon filter-green"
          onClick={() =>
            toggleShuffle(shuffle_state, access_token, refresh_token)
          }
        />
      </div>
    );
  }
  return (
    <div className="shuffle-container d-flex align-items-center justify-content-center">
      <span id="shuffle" className="icon" onClick={toggleShuffle} />
    </div>
  );
};

Shuffle.propTypes = {
  shuffle_state: PropTypes.string.isRequired,
  toggleShuffle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  shuffle_state: state.shuffle_state,
  access_token: state.access_token,
  refresh_token: state.refresh_token,
});

const mapDispatchToProps = { toggleShuffle };

export default connect(mapStateToProps, mapDispatchToProps)(Shuffle);
