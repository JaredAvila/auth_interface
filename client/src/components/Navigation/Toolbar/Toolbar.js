import React from "react";
import NavItems from "../NavItems/NavItems";
import { Link } from "react-router-dom";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

import * as styles from "./Toolbar.module.css";

const Toolbar = props => {
  return (
    <header className={styles.Toolbar}>
      <DrawerToggle clicked={props.toggleDrawer} />
      <Link to="/">
        <h1>Juvicount</h1>
      </Link>
      <nav className={styles.DesktopOnly}>
        <NavItems />
      </nav>
    </header>
  );
};

export default Toolbar;
