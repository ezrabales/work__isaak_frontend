import { NavLink } from "react-router-dom";
import "./Footer.css";
import { useGlobal } from "../GlobalState/GlobalState";
import ContactEzraModal from "../Modal/ContactEzraModal";

const Footer = ({ isLoggedIn, setIsLoggedIn }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const token = localStorage.getItem("jwt");
  return (
    <div className="footer">
      <div className="footer__nav-container">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/settings"}>Price Settings</NavLink>
        <NavLink to={"/history"}>History</NavLink>
      </div>
      <button
        className="footer__contact-btn"
        onClick={() => setModalOpen("ezra")}
      >
        Contact Ezra
      </button>
      {isLoggedIn && (
        <button
          className="footer__logout-btn"
          onClick={() => {
            setIsLoggedIn(false);
            localStorage.removeItem("jwt");
          }}
        >
          Log Out
        </button>
      )}
      <ContactEzraModal token={token} />
    </div>
  );
};
export default Footer;
