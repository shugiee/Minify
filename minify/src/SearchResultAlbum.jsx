import React from "react";

// TODO FINISH

const SearchResultAlbum = props => {
  const { album, playAlbum, toggleSearchVisibility, showSearchBar } = props;
  if (showSearchBar) {
    return (
      <div
        className="search-result-container"
        onClick={() => {
          playAlbum(album);
          toggleSearchVisibility();
        }}
      >
        <img
          src={album.images[2].url}
          className="card-img search-image"
          alt="Seach result album artwork"
        />
        <p className="search-information-song-name">{album.name}</p>
        <p className="search-information-artist-name">
          {album.artists
            .map(artist => {
              return artist.name;
            })
            .join(" & ")}
        </p>
      </div>
    );
  }
  return <div className="hidden" />;
};

export default SearchResultAlbum;
