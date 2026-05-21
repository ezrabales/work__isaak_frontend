import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="header__left">
          <NavLink to="./" className="header__title">
            <h1>Plumbing Tech</h1>
          </NavLink>
        </div>
        <div className="header__right">
          <NavLink to="./">Home</NavLink>
          <NavLink to="./settings">Price Settings</NavLink>
          <NavLink to="./history">History</NavLink>
        </div>
      </div>
      <span className="header__spacer" />
    </>
  );
};
export default Header;
