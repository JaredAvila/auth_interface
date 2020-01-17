import React from "react";
import { Redirect } from "react-router-dom";
import { Container, Grid } from "@material-ui/core";

import { connect } from "react-redux";

const Home = props => {
  if (!props.isAuth) {
    return <Redirect to="/login" />;
  }
  console.log(props.user);
  return (
    <Container>
      <div>
        <img
          src={`http://127.0.0.1:8000/img/users/${props.user.photo}`}
          alt={props.user.name}
        />
      </div>
      <div>
        <h1>{props.user.name}</h1>
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
