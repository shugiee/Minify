import axios from 'axios';

const playSong = (songId = null) => {
  const payload = { songId };
  axios.put('http://localhost:2727', payload);
};

export { playSong };
