import { useState } from "react";
import { authorize, register } from "../../utils/auth";
import Form from "../Form/Form";
import "./LogIn.css";
import { Navigate, useNavigate } from "react-router-dom";

const LogIn = ({ setIsLoggedIn }) => {
  const [authOption, setAuthOption] = useState("logIn");
  const navigate = useNavigate();

  const handleLogIn = ({ email, password }) => {
    authorize({ email, password })
      .then((res) => {
        const handleLogIn = ({ email, password }) => {
          authorize({ email, password })
            .then((res) => {
              if (res.token) {
                localStorage.setItem("jwt", res.token);
                setIsLoggedIn(true);
                navigate("/");
              }
            })
            .catch(console.error);
        };
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRegister = ({ email, password, name }) => {
    register({ password, email, name })
      .then(() => {
        return authorize({ email, password });
      })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
        }
        setIsLoggedIn(true);
        navigate("/");
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
