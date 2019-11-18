const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const spotify = require('spotify-node-applescript');

const app = express();
const port = 2727;

const jsonParser = bodyParser.json();

app.use(bodyParser.json());

app.use(cors());

app.get('/song', (req, res) => {
  res.send('success!!');
});

// play a new song
app.put('/song', (req, res) => {
  res.send(req.body);
  // spotify.playTrack(`spotify:track:3AhXZa8sUQht0UEdBJgpGc`, function() {
  //   // track is playing
  // });
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
