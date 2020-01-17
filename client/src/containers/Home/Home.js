import React from "react";
import { Redirect } from "react-router-dom";
import { Container, Grid, Chip, Avatar } from "@material-ui/core";

import * as classes from "./Home.module.css";

import { connect } from "react-redux";

const Home = props => {
  if (!props.isAuth) {
    return <Redirect to="/login" />;
  }
  console.log(props.user);
  return (
    <Container>
      <div className={classes.Top}>
        <img
          src={`http://127.0.0.1:8000/img/users/${props.user.photo}`}
          alt={props.user.name}
        />
        <h1>{props.user.name}</h1>
      </div>
      <div className={classes.Bot}>
        <h3 className={classes.AddText}>Child Accounts</h3>
        {props.user.children.map(child => {
          return (
            <div className={classes.ChildCard}>
              <img
                src={`http://127.0.0.1:8000/img/users/${child.photo}`}
                alt={child.name}
              />
              <h3>{child.name}</h3>
            </div>
          );
        })}
        <div className={classes.ChildCard}>
          <p className={classes.PlusButton}>+</p>
          <h3>Add new child</h3>
        </div>
      </div>
    </Container>
  );
};

const mapSateToProps = state => {
  return {
    loading: state.auth.loading,
    isAuth: state.auth.isAuth,
    user: state.auth.user
  };
};

export default connect(mapSateToProps)(Home);
