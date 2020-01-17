import React from "react";
import { Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Login from "./containers/Auth/Login/Login";
import Register from "./containers/Auth/Register/Register";
import Layout from "./hoc/Layout/Layout";
import Logout from "./containers/Auth/Logout/Logout";
import Home from "./containers/Home/Home";

const App = () => {
  return (
    <Layout>
      <Route path="/" exact component={Landing} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/logout" component={Logout} />
      <Route path="/home" component={Home} />
    </Layout>
  );
};

export default App;
