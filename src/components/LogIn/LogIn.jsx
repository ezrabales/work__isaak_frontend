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

  const handleLogIn = ({ email, password }) =>
    authorize({ email, password })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          navigate(from, { replace: true });
          return { success: true };
        }
        return {
          success: false,
          message: "No token returned",
        };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message || err?.response?.data?.message || "Login failed",
        };
      });

  const handleRegister = (values) => {
    return register({
      key: values.key,
      email: values.email,
      password: values.password,
      name: values.name,
      rate: values.rate,
      phone: values.phone,
      footer: {
        companyName: values.companyName,
        address: values.address,
        payableNote: values.payableNote,
        thankYou: values.thankYou,
      },
    })
      .then(() => {
        return authorize({ email: values.email, password: values.password });
      })
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          navigate(from, { replace: true });
          return { success: true };
        }
        return { success: false, message: "No token returned" };
      })
      .catch((err) => {
        console.error(err);
        return {
          success: false,
          message:
            err?.message || err?.response?.data?.message || "Register failed",
        };
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
            OR Register
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
                name: "key",
                type: "text",
                placeholder: "Register Key",
                labelText: "Register Key *",
                required: true,
              },
              {
                name: "name",
                type: "text",
                placeholder: "Name",
                labelText: "Name",
              },
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
              {
                name: "rate",
                type: "number",
                placeholder: "Hourly Rate",
                labelText: "Hourly Rate",
              },

              <div className="login__form-break">
                The following inputs will be displayed under each invoice:
              </div>,
              {
                name: "phone",
                type: "number",
                placeholder: "Phone Number",
                labelText: "Phone Number",
              },
              {
                name: "companyName",
                type: "text",
                placeholder: "Company Name",
                labelText: "Company name",
              },
              {
                name: "address",
                type: "text",
                placeholder: "For checks",
                labelText: "Address",
              },
              {
                name: "payableNote",
                type: "text",
                placeholder: "Pay me in this way:",
                labelText: "Payable Note",
              },
              {
                name: "thankYou",
                type: "text",
                placeholder: "A thank you note",
                labelText: "Thank You Note",
              },
            ]}
          />
        </div>
        <div className="login__btn-container">
          <button
            className="login__switch-btn"
            onClick={() => setAuthOption("logIn")}
          >
            OR Log In
          </button>
        </div>
      </div>
    );
};
export default LogIn;
