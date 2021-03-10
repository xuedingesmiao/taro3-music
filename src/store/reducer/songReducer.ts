const initialState = {
  playingList: [],
  playingSong: null,
  playingCurrentTime: '00:00',
  playingProgressValue: 0,
  playingSongUrl: null,
  playingSongIndex: null,
  playMode: 'loop',
  shufflePlayingList: [],
  playingListId: null,
  playingListName: null
};

enum ActionType {
  ADD_SONG = 'ADD_SONG',
  ADD_PLAYINGSONG = 'ADD_PLAYINGSONG',
  ADD_PLAYINGLIST = 'ADD_PLAYINGLIST',
  SET_PLAYINGCURRENTTIME = 'SET_PLAYINGCURRENTTIME',
  SET_PLAYINGPROGRESSVALUE = 'SET_PLAYINGPROGRESSVALUE',
  ADD_SONGURL = 'ADD_SONGURL',
  ADD_SONGINDEX = 'ADD_SONGINDEX',
  SET_PLAYMODE = 'SET_PLAYMODE',
  SET_SHUFFLEPLAYINGLIST = 'SET_SHUFFLEPLAYINGLIST',
  SET_PLAYINGLISTID = 'SET_PLAYINGLISTID',
  SET_PLAYINGLISTNAME = 'SET_PLAYINGLISTNAME'
}

type PlayMode = 'loop' | 'shuffle' | 'one';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.ADD_SONG:
      return { ...state, playingList: [...state.playingList, action.data] };
    case ActionType.ADD_PLAYINGSONG:
      return { ...state, playingSong: action.data };
    case ActionType.ADD_PLAYINGLIST:
      return { ...state, playingList: action.data };
    case ActionType.ADD_SONGURL:
      return { ...state, playingSongUrl: action.data };
    case ActionType.ADD_SONGINDEX:
      return { ...state, playingSongIndex: action.data };
    case ActionType.SET_PLAYINGCURRENTTIME:
      return { ...state, playingCurrentTime: action.data };
    case ActionType.SET_PLAYINGPROGRESSVALUE:
      return { ...state, playingProgressValue: action.data };
    case ActionType.SET_PLAYMODE:
      return { ...state, playMode: action.data };
    case ActionType.SET_SHUFFLEPLAYINGLIST:
      return { ...state, shufflePlayingList: action.data };
    case ActionType.SET_PLAYINGLISTID:
      return { ...state, playingListId: action.data };
    case ActionType.SET_PLAYINGLISTNAME:
      return { ...state, playingListName: action.data };
    default:
      return state;
  }
};

export const addSong = song => {
  return {
    type: ActionType.ADD_SONG,
    data: song
  };
};

export const addPlayingSong = song => {
  return {
    type: ActionType.ADD_PLAYINGSONG,
    data: song
  };
};

export const addPlayingList = songList => {
  return {
    type: ActionType.ADD_PLAYINGLIST,
    data: songList
  };
};

export const setPlayingCurrentTime = time => {
  return {
    type: ActionType.SET_PLAYINGCURRENTTIME,
    data: time
  };
};

export const setPlayingProgressValue = value => {
  return {
    type: ActionType.SET_PLAYINGPROGRESSVALUE,
    data: value
  };
};

export const addPlayingSongUrl = url => {
  return {
    type: ActionType.ADD_SONGURL,
    data: url
  };
};

export const addPlayingSongIndex = index => {
  return {
    type: ActionType.ADD_SONGINDEX,
    data: index
  };
};

export const setPlayMode = (mode: PlayMode) => {
  return {
    type: ActionType.SET_PLAYMODE,
    data: mode
  };
};

export const setShufflePlayingList = songList => {
  return {
    type: ActionType.SET_SHUFFLEPLAYINGLIST,
    data: songList
  };
};

export const addPlayingListId = listId => {
  return {
    type: ActionType.SET_PLAYINGLISTID,
    data: listId
  };
};

export const addPlayingListName = listName => {
  return {
    type: ActionType.SET_PLAYINGLISTNAME,
    data: listName
  };
};

export default reducer;
