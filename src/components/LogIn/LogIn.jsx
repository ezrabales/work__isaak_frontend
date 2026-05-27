import { useState } from "react";
import { authorize, register } from "../../utils/auth";
import Form from "../Form/Form";
import "./LogIn.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const LogIn = ({ setIsLoggedIn }) => {
  const [authOption, setAuthOption] = useState("logIn");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogIn = ({ email, password }) => {
    authorize({ email, password })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          navigate(from, { replace: true });
        }
      })
      .catch(console.error);
  };

  const handleRegister = ({ email, password }) => {
    register({ password, email })
      .then(() => {
        return authorize({ email, password });
      })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
        }
        setIsLoggedIn(true);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error("Registration or login error:", err);
      });
  };

  if (authOption == "logIn")
    return (
      <div className="login">
        <h2 className="login__title">Log In</h2>
        <div className="login__form-container">
          <Form
            onSuccessfulSubmit={handleLogIn}
            inputs={[
              {
                name: "email",
                type: "email",
                placeholder: "Email",
                labelText: "Email *",
                required: true,
              },
              {
                name: "password",
                type: "password",
                placeholder: "Password",
                labelText: "Password *",
                required: true,
              },
            ]}
          />
        </div>
        <div className="login__btn-container">
          <button
            className="login__switch-btn"
            onClick={() => setAuthOption("register")}
          >
            Register
          </button>
        </div>
      </div>
    );
  if (authOption == "register")
    return (
      <div className="login">
        <h2 className="login__title">Register</h2>
        <div className="login__form-container">
          <Form
            onSuccessfulSubmit={handleRegister}
            inputs={[
              {
                name: "email",
                type: "email",
                placeholder: "Email",
                labelText: "Email *",
                required: true,
              },
              {
                name: "password",
                type: "password",
                placeholder: "Password",
                labelText: "Password *",
                required: true,
              },
            ]}
          />
        </div>
        <div className="login__btn-container">
          <button
            className="login__switch-btn"
            onClick={() => setAuthOption("logIn")}
          >
            Log In
          </button>
        </div>
      </div>
    );
};
export default LogIn;
