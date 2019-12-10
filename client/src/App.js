import React from "react";
import { Route } from "react-router-dom";
import Wallet from "./containers/Wallet/Wallet";
import Landing from "./components/Landing/Landing";
import Login from "./containers/Auth/Login/Login";
import Register from "./containers/Auth/Register/Register";
import Layout from "./hoc/Layout/Layout";

const App = () => {
  return (
    <Layout>
      <Route path="/" exact component={Landing} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/wallet" component={Wallet} />
    </Layout>
  );
};

export default App;
