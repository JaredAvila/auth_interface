import React, { Component } from "react";
import axios from "axios";

import Input from "../../../UI/Input/Input";
import { NavLink } from "react-router-dom";
import { checkValidation } from "../../../helpers/validation";

import * as styles from "./Register.module.css";

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
    try {
      const newUser = {
        name: this.state.controls["name"].value,
        email: this.state.controls["email"].value,
        password: this.state.controls["password"].value,
        password2: this.state.controls["password2"].value
      };
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        body,
        config
      );
      console.log("Response: ", res);
    } catch (err) {
      console.log("Error: ", err);
    }
    //Submit to be authenticated
    this.props.history.push("/wallet");
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
    return (
      <div className={styles.Register}>
        <div>
          <h4>Create an account</h4>
          <form onSubmit={this.onSubmitHandler}>
            {form}
            <input className={styles.Btn} type="submit" value="Sign In" />
            {this.state.noMatch ? (
              <p className={styles.ErrorMsg}>Passwords do not match</p>
            ) : null}
          </form>
          <p className={styles.Accnt}>Already have an account?</p>
          <NavLink className={styles.Link} to={"/login"}>
            SIGN IN
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Register;
