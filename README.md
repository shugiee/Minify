## Minify

A mini Spotify controller made with React, and Electron, and the Spotify API.


## Demo

![Minify Demo](demo/Minify.gif)


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

You will then be promted to login to your personal Spotify account (authentication is done server-side, via the provided express server in conjunction with the Spotify API for token generation). Note that as a Spotify controller, you must have a currently active device playing Spotify in order to successfull toggle playback within Minify.


## General Information

This app is intended to be a complement to an official Spotify app, offering the ability to toggle playback, search Spotify, manipulate library via a smaller-sized application than the official Spotify native desktop app.

## Future

I plan to continue development on this application. In the works:

* Port the authentication server to AWS
* Implement comprehensive testing
* Publish production-ready, packaged application
