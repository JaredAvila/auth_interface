import * as actionTypes from "./actionTypes";
import axios from "axios";
import axiosInst from "../../helpers/axiosInstance";

export const register = (
  name,
  email,
  password,
  password2
) => async dispatch => {
  dispatch(authStart());
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password, password2 });

  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/user/register",
      body,
      config
    );
    console.log(res);
    dispatch({
      type: actionTypes.REGISTER_SUCCESS,
      payload: res.data.token
    });
  } catch (err) {
    dispatch({
      type: actionTypes.AUTH_FAIL,
      payload: err.response.data
    });
  }
};

export const login = (email, password) => async dispatch => {
  dispatch(authStart());
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axiosInst.post(
      "http://localhost:8000/api/v1/user/login",
      body,
      config
    );
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: res.data.token
    });
  } catch (err) {
    dispatch({
      type: actionTypes.AUTH_FAIL,
      payload: err.response.data
    });
  }
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
