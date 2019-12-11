import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  isAuth: false,
  loading: false,
  user: null,
  error: null
};

const authStart = (state, action) => {
  const newState = { ...state, error: null, loading: true };
  return newState;
};

const regSuccess = (state, action) => {
  const newState = {
    ...state,
    loading: false,
    token: action.payload.token,
    isAuth: true,
    user: action.payload.data.user
  };
  return newState;
};

const loginSuccess = (state, action) => {
  console.log(action.payload);
  const newState = {
    ...state,
    loading: false,
    token: action.payload.token,
    isAuth: true,
    user: action.payload.data.user
  };
  return newState;
};

const authFail = (state, action) => {
  return {
    ...state,
    token: null,
    isAuth: false,
    loading: false,
    error: action.payload
  };
};

const authLogout = (state, action) => {
  const newState = {
    ...state,
    loading: false,
    token: null,
    isAuth: false,
    user: null
  };
  return newState;
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.REGISTER_SUCCESS:
      return regSuccess(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default authReducer;
