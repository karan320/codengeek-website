import React, { useState, useEffect } from "react";
import "./LogInScreen.css";
import MyCard from "../../components/card/MyCard";
import Particle from "../../components/Particles";
import { Link } from "react-router-dom";
import { authenticate, isAuthenticate } from "../../auth/authHelper";
import axios from "axios";
import Toast from "../../components/toast/Toast";

import { showToast } from "../../components/toast/helper/toastHelper";

const LogInScreen = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [list, setList] = useState([]);
  let toastProperties = null;

  useEffect(() => {
    if (isAuthenticate()) {
      history.push("/");
    }
  }, [history]);

  const handleOnCheckboxClick = () => {
    setIsChecked(!isChecked);
    setShowPassword(!showPassword);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const { data } = await axios.post("/api/v1/auth/login", { email, password }, config);
      console.log("DATA", data);

      authenticate(data);
      history.push("/");  
    } catch (err) {
     
     toastProperties = showToast('error', err.response.data.error)
     setList([...list, toastProperties]);
     
    }
  };

  const loginForm = () => {
    return (
      <form onSubmit={loginHandler} className="login-form">
    
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            required
            type="email"
            value={email}
            id="email"
            placeholder="Enter Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">
            Password:
            <Link to="/forgotpassword" className="login-screen__forgotpassword register-link">
              Forgot Password?
            </Link>
          </label>
          <input
            name="password"
            required
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <div className="check">
          <input
            type="checkbox"
            id="check-box"
            checked={isChecked}
            onChange={handleOnCheckboxClick}
          />
          <label htmlFor="checkbox" id="show-pass" onClick={handleOnCheckboxClick}>
            Show password
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <span className="login-screen__subtext">
          Don't have an account?
          <Link to="/register" className="register-link">
            Register
          </Link>
        </span>
      </form>
    );
  };

  return (
    <div className="login-container">
      <Particle />
      <Toast toastList={list} autoDelete={true} dismissTime={3000} />
      <div className="login-card">
        
        <MyCard title="Login">{loginForm()}</MyCard>
      </div>
    </div>
  );
};

export default LogInScreen;