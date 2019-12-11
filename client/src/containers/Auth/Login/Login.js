import React, { Component } from "react";

import { NavLink } from "react-router-dom";
import { checkValidation } from "../../../helpers/validation";
import { connect } from "react-redux";

import Spinner from "../../../UI/Spinner/Spinner";
import Input from "../../../UI/Input/Input";

import * as styles from "./Login.module.css";
import * as actions from "../../../store/actions/";

class Login extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Email",
          autoComplete: "username"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
          autoComplete: "current-password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    }
  };

  onChangedHandler = (e, type) => {
    const updatedControls = {
      ...this.state.controls,
      [type]: {
        ...this.state.controls[type],
        value: e.target.value,
        valid: checkValidation(
          e.target.value,
          this.state.controls[type].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    //Submit to be authenticated
    this.props.onLogin(
      this.state.controls["email"].value,
      this.state.controls["password"].value
    );
    this.setState({ username: "", password: "" });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = formElementsArray.map(formElement => {
      return (
        <Input
          key={formElement.id}
          inputType={formElement.config.elementType}
          config={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={e => this.onChangedHandler(e, formElement.id)}
        />
      );
    });
    let errorMsg = this.props.error ? (
      <p className={styles.ErrorMsg}>{this.props.error.message}</p>
    ) : null;

    let markup = <Spinner />;
    if (!this.props.loading) {
      markup = (
        <div className={styles.Login}>
          <div className={styles.RegBox}>
            <h4>Sign In</h4>
            {errorMsg}
            <form onSubmit={this.onSubmitHandler}>
              {form}
              <input className={styles.Btn} type="submit" value="Log In" />
            </form>
            <p className={styles.Accnt}>Don't have an account?</p>
            <NavLink className={styles.Link} to={"/register"}>
              Create one now
            </NavLink>
          </div>
        </div>
      );
    }
    return markup;
  }
}

const mapSateToProps = state => {
  return {
    loading: state.auth.loading,
    isAuth: state.auth.isAuth,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (email, password) => dispatch(actions.login(email, password))
  };
};

export default connect(mapSateToProps, mapDispatchToProps)(Login);
