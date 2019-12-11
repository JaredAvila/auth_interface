import React from "react";
import NavItem from "./NavItem/NavItem";

import * as styles from "./NavItems.module.css";

const NavItems = props => {
  return (
    <ul className={styles.NavItems} onClick={props.clicked}>
      <NavItem link="/login">Login</NavItem>
      <NavItem link="/register">Register</NavItem>
    </ul>
  );
};

export default NavItems;