import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { GlobalProvider } from "../GlobalState/GlobalState";
import Header from "../Header/Header";
import Main from "../Main/Main";
import PriceSettings from "../PriceSettings/PriceSettings";
import History from "../History/History";
import Footer from "../Footer/Footer";
import ProtectedRoute from "../ProtectedRoute";
import LogIn from "../LogIn/LogIn";
import { checkToken } from "../../utils/auth";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = localStorage.getItem("jwt");
    const from = location.pathname === "/login" ? "/" : location.pathname;

    if (!currentToken) {
      return;
    }

    setToken(currentToken);

    checkToken(currentToken)
      .then(() => {
        setIsLoggedIn(true);
        navigate(from, { replace: true });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PriceSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </GlobalProvider>
  );
};
export default App;
