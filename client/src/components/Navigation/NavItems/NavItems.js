import React from "react";
import { connect } from "react-redux";
import NavItem from "./NavItem/NavItem";
import { Avatar, Chip } from "@material-ui/core";

import * as styles from "./NavItems.module.css";

const NavItems = props => {
  if (props.isAuth) {
    return (
      <ul className={styles.NavItems} onClick={props.clicked}>
        <Chip
          avatar={
            <Avatar
              alt="User Img"
              src={`http://127.0.0.1:8000/img/users/${props.user.photo}`}
            />
          }
          label={props.user.name}
        />
        <NavItem link="/logout">Logout</NavItem>
      </ul>
    );
  } else {
    return (
      <ul className={styles.NavItems} onClick={props.clicked}>
        <NavItem link="/login">Login</NavItem>
        <NavItem link="/register">Register</NavItem>
      </ul>
    );
  }
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(NavItems);
