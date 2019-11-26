# Minify

A mini Spotify controller made with [React](https://reactjs.org/), [Electron](https://electronjs.org/), and [the Spotify API](https://developer.spotify.com/).

## Demo

<!-- ![Minify Demo](demo/Minify.gif) -->

<p align="center">
  <img width="300" height="500" src="demo/Minify.gif">
</p>

## Inspiration

This is an application that I've personally wanted to have for a long time -- so I decided to build it. Since I have such a strong personal motivation behind the app, I intend to continue development with the intent of creating a comprehensive stand-in for the official Spotify desktop app.

## Usage

This application can be downloaded and run via:

```
git clone https://github.com/MyNameIsJonathan/Minify.git

cd Minify
```

Terminal Session #1

```
cd minify

npm run start-react
```

Terminal Session #2

```
cd electron

npm run start-electron
```

You will then be prompted to login to your personal Spotify account (authentication is done server-side, via the provided express server in conjunction with the Spotify API for token generation). Note that as a Spotify controller, you must have a currently active device playing Spotify in order to successfully toggle playback within Minify.

## General Information

This app is intended to be a complement to an official Spotify app, offering the ability to toggle playback, search Spotify, and manipulate user library via a smaller-sized application.

## Features

With this app you can control Spotify playback via:

-   Play/pause
-   Seek to previous track
-   Seek to next track
-   Toggle shuffle
-   Toggle repeat mode
-   Scrub song playback
-   Toggle song like status (add to/remove from user's library)
-   Search for and play Spotify tracks, albums, artists, and playlists

-   ...with more to come!

## Future

I plan to continue development on this application. In the works:

-   Port the authentication server to AWS
-   Implement comprehensive testing
-   Publish production-ready, packaged application

## Credits

This recreationally-driven application was built using the generously-provided [Spotify API](https://developer.spotify.com/). This application has no commercial intent and bears no claim to Spotify-owned or Spotify-leased content.
