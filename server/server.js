const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const jsonParser = bodyParser.json();

app.use(cors());

// play a new song
app.put('song', (req, res) => {
  req.send(res.body);
  // spotify.playTrack(`spotify:track:3AhXZa8sUQht0UEdBJgpGc`, function() {
  //   // track is playing
  // });
});

app.listen(2727, () => {
  console.log('Express server running!!');
});
