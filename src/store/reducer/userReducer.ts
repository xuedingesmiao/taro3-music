import Taro from '@tarojs/taro';

const initialState = {
  userId: Taro.getStorageSync('userId'),
  userProfile: Taro.getStorageSync('userProfile')
};

enum ActionType {
  SET_USERID = 'SET_USERID',
  SET_USERPROFILE = 'SET_USERPROFILE',
  RESET_USER = 'RESET_USER'
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_USERID:
      return { ...state, userId: action.data };
    case ActionType.SET_USERPROFILE:
      return { ...state, userProfile: action.data };
    case ActionType.RESET_USER:
      return { userProfile: null, userId: null };
    default:
      return state;
  }
};

export const setUserId = userId => {
  return {
    type: ActionType.SET_USERID,
    data: userId
  };
};
export const resetUser = () => {
  return {
    type: ActionType.RESET_USER
  };
};
export const setUserProfile = profile => {
  return {
    type: ActionType.SET_USERPROFILE,
    data: profile
  };
};

export default reducer;
