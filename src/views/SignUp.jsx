import "../css/components/LogIn.css";

import { Link, useNavigate } from "react-router-dom";

import Animation from "../components/Animation.jsx";
import Input from "../components/Input";
import Password from "../components/Password.jsx";
import React from "react";
import { signUpWithEmail } from "../supabase/supabase";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, set_username] = React.useState("");
  const [email, set_email] = React.useState("");
  const [password, set_password] = React.useState("");
  const [confirmation, set_confirmation] = React.useState("");
  const [err_msg, set_err_msg] = React.useState("");
  const [rule_1, set_rule_1] = React.useState("danger");
  const [rule_2, set_rule_2] = React.useState("danger");
  const [rule_3, set_rule_3] = React.useState("danger");
  const [rule_4, set_rule_4] = React.useState("danger");
  const [rule_5, set_rule_5] = React.useState("danger");
  const [rule_6, set_rule_6] = React.useState("danger");
  const [rule_7, set_rule_7] = React.useState("danger");

  let signup_handler = () => {
    console.log(email);
    signUpWithEmail(username, email, password, (data, errCode) => {
      console.log(data);

      if (errCode === 1) {
        set_err_msg("Username taken. Please enter something else.");
      } else {
        navigate("/chess-cage/verify");
      }
    });
  };

  const validate_password = (val) => {
    if (val.length < 8 || val.length > 20) {
      set_rule_1("danger");
    } else {
      set_rule_1("success");
    }

    if (!/[A-Z]/.test(val)) {
      set_rule_2("danger");
    } else {
      set_rule_2("success");
    }

    if (!/[a-z]/.test(val)) {
      set_rule_3("danger");
    } else {
      set_rule_3("success");
    }

    if (!/[a-z]/.test(val)) {
      set_rule_4("danger");
    } else {
      set_rule_4("success");
    }

    if (password !== confirmation) {
      set_rule_5("danger");
    } else {
      set_rule_5("success");
    }
  };

  const validate_email = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
      set_rule_6("success");
    } else {
      set_rule_6("danger");
    }
  };

  const validate_username = (val) => {
    if (val.length >= 3 && val.length <= 20) {
      set_rule_7("success");
    } else {
      set_rule_7("danger");
    }
  };

  const validate_confirmation = (val) => {
    if (val === password) {
      set_rule_5("success");
    } else {
      set_rule_5("danger");
    }
  };

  const handle_username_change = (val) => {
    set_username(val);
    validate_username(val);
  };

  const handle_email_change = (val) => {
    set_email(val);
    validate_email(val);
  };

  const handle_password_change = (val) => {
    validate_password(val);
    set_password(val);
    console.log(val);
  };

  const handle_confirmation_change = (val) => {
    validate_confirmation(val);
    set_confirmation(val);
  };

  return (
    <div className="body flex justify-center align-center">
      <div className="container flex flew-row">
        <div className="form flex-flex-column">
          <h2 className="header-2">Sign up</h2>
          <p className="switch-link">
            Already have an account?{" "}
            <Link className="emp no-decoration" to="/login">
              Log in.
            </Link>{" "}
          </p>
          <div className="input-container">
            <Input
              placeholder="Username"
              icon="pi-user"
              type="text"
              value={username}
              set_value={handle_username_change}
            />
          </div>
          <div className="input-container">
            <Input
              placeholder="Email"
              icon="pi-envelope"
              type="text"
              value={email}
              set_value={handle_email_change}
            />
          </div>
          <div className="input-container">
            <Password
              placeholder="Password"
              icon="pi-lock"
              type="password"
              value={password}
              set_value={handle_password_change}
            />
          </div>
          <div className="input-container">
            <Password
              placeholder="Confirm Password"
              icon="pi-unlock"
              type="password"
              value={confirmation}
              set_value={handle_confirmation_change}
            />
          </div>
          <ul className="rules flex flex-column align-self-center">
            <li className={rule_7}>
              Username should be between 3 and 20 characters
            </li>
            <li className={rule_6}>Email should be valid</li>
            <li className={rule_1}>
              Password should be between 8 and 20 characters
            </li>
            <li className={rule_2}>
              Password should contain at least one uppercase character
            </li>
            <li className={rule_3}>
              Password should contain at least one lowercase character
            </li>
            <li className={rule_4}>
              Password should contain at least one numeric character
            </li>
            <li className={rule_5}>Password and confirmation should match</li>
          </ul>
          <p className="err">{err_msg}</p>
        </div>
        <button
          className="btn-flex"
          onClick={signup_handler}
          disabled={
            rule_1 === "danger" ||
            rule_2 === "danger" ||
            rule_3 === "danger" ||
            rule_4 === "danger" ||
            rule_5 === "danger" ||
            rule_6 === "danger" ||
            rule_7 === "danger"
          }
        >
          Sign up
        </button>
        <div className="image">
          <p className="subtitle">Sign up to get access to all features</p>
          <div className="board-container-form">
            <Animation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
