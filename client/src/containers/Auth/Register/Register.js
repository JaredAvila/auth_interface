import React, { Component } from "react";

import Input from "../../../UI/Input/Input";
import { NavLink, Redirect } from "react-router-dom";
import { checkValidation } from "../../../helpers/validation";
import { connect } from "react-redux";

import Spinner from "../../../UI/Spinner/Spinner";

import * as styles from "./Register.module.css";
import * as actions from "../../../store/actions/";

class Register extends Component {
  state = {
    controls: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Name"
        },
        value: "",
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Email",
          autoComplete: "username"
        },
        value: "",
        valid: false,
        touched: false,
        validation: {
          required: true,
          isEmail: true
        }
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
          autoComplete: "new-password"
        },
        value: "",
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLength: 6
        }
      },
      password2: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Confirm Password",
          autoComplete: "new-password"
        },
        value: "",
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLength: 6
        }
      }
    },
    noMatch: false
  };

  onChangedHandler = (e, type) => {
    const updatedControls = {
      ...this.state.controls,
      [type]: {
        ...this.state.controls[type],
        value: e.target.value,
        touched: true,
        valid: checkValidation(
          e.target.value,
          this.state.controls[type].validation
        )
      }
    };
    this.setState({ controls: updatedControls, noMatch: false });
  };

  onSubmitHandler = async e => {
    e.preventDefault();
    if (
      this.state.controls["password"].value !==
      this.state.controls["password2"].value
    ) {
      this.setState({ noMatch: true });
      return;
    }
    //Submit to be authenticated
    this.props.onRegister(
      this.state.controls["name"].value,
      this.state.controls["email"].value,
      this.state.controls["password"].value,
      this.state.controls["password2"].value
    );
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

    let errorMsg = null;
    if (this.props.error) {
      errorMsg = <p className={styles.ErrorMsg}>{this.props.error.message}</p>;
    }
    if (this.state.noMatch) {
      errorMsg = <p className={styles.ErrorMsg}>Passwords do not match</p>;
    }
    let markup = <Spinner />;

    if (!this.props.loading) {
      markup = (
        <div className={styles.Register}>
          <div className={styles.RegBox}>
            <h4>Create an account</h4>
            {errorMsg}
            <form onSubmit={this.onSubmitHandler}>
              {form}
              <input className={styles.Btn} type="submit" value="Sign In" />
            </form>
            <p className={styles.Accnt}>Already have an account?</p>
            <NavLink className={styles.Link} to={"/login"}>
              SIGN IN
            </NavLink>
          </div>
        </div>
      );
    }
    if (this.props.isAuth) {
      markup = <Redirect to="/home" />;
    }

    return markup;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRegister: (name, email, password, password2) =>
      dispatch(actions.register(name, email, password, password2))
  };
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    isAuth: state.auth.isAuth,
    error: state.auth.error
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
