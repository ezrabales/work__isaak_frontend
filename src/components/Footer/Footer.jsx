import { NavLink } from "react-router-dom";
import "./Footer.css";
import { useGlobal } from "../GlobalState/GlobalState";
import ContactEzraModal from "../Modal/ContactEzraModal";

const Footer = () => {
  const { modalOpen, setModalOpen } = useGlobal();
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
      <ContactEzraModal />
    </div>
  );
};
export default Footer;
