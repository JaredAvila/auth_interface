import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: localStorage.getItem("token"),
  isAuth: false,
  loading: true,
  user: null
};

const authStart = (state, action) => {
  const newState = { ...state, error: null, loading: true };
  return newState;
};

const regSuccess = (state, action) => {
  const newState = {
    ...state,
    loading: false,
    token: action.token,
    isAuth: true
  };
  localStorage.setItem("token", action.token);
  return newState;
};

const regFail = (state, action) => {
  localStorage.removeItem("token");
  return {
    ...state,
    token: null,
    isAuth: false,
    loading: false
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
    case actionTypes.REGISTER_FAIL:
      return regFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default authReducer;
