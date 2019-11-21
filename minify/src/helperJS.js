export function getUrlVars() {
  var vars = {};
  window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

export const templateCurrentSong = {
  device: {
    id: '',
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: '',
    type: '',
    volume_percent: 0
  },
  shuffle_state: false,
  repeat_state: '',
  timestamp: 0,
  context: {
    external_urls: {
      spotify: ''
    },
    href: '',
    type: '',
    uri: ''
  },
  progress_ms: 0,
  item: {
    album: {
      album_type: '',
      artists: [
        {
          external_urls: {
            spotify: ''
          },
          href: '',
          id: '',
          name: '',
          type: '',
          uri: ''
        },
        {
          external_urls: {
            spotify: ''
          },
          href: '',
          id: '',
          name: '',
          type: '',
          uri: ''
        }
      ],
      available_markets: [],
      external_urls: {
        spotify: ''
      },
      href: '',
      id: '',
      images: [
        {
          height: '',
          url: '',
          width: 0
        },
        {
          height: '',
          url: '',
          width: 0
        },
        {
          height: '',
          url: '',
          width: 0
        }
      ],
      name: '',
      release_date: '',
      release_date_precision: '',
      total_tracks: 0,
      type: '',
      uri: ''
    },
    artists: [
      {
        external_urls: {
          spotify: ''
        },
        href: '',
        id: '',
        name: '',
        type: '',
        uri: ''
      },
      {
        external_urls: {
          spotify: ''
        },
        href: '',
        id: '',
        name: '',
        type: '',
        uri: ''
      }
    ],
    available_markets: [],
    disc_number: 0,
    duration_ms: 0,
    explicit: false,
    external_ids: {
      isrc: ''
    },
    external_urls: {
      spotify: ''
    },
    href: '',
    id: '',
    is_local: false,
    name: '',
    popularity: 0,
    preview_url: '',
    track_number: 0,
    type: '',
    uri: ''
  },
  currently_playing_type: 'track',
  actions: {
    disallows: {
      resuming: true
    }
  },
  is_playing: false
};

// export { getUrlVars, templateCurrentSong};
