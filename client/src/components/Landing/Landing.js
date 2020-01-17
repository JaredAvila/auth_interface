import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import * as classes from "./Landing.module.css";

const Landing = props => {
  if (props.isAuth) {
    return <Redirect to="/home" />;
  }
  return (
    <div className={classes.Landing}>
      <h1>Juvicount</h1>
      <div className={classes.Buttons}>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth
  };
};

export default connect(mapStateToProps)(Landing);
