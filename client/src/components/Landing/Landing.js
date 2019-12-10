import React from "react";
import { Link } from "react-router-dom";

import * as classes from "./Landing.module.css";

const Landing = () => {
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

export default Landing;
