import { useEffect, useState } from "react";
import "./Modal.css";
import { useGlobal } from "../GlobalState/GlobalState";

const Modal = ({ children, title }) => {
  const { modalOpen, setModalOpen } = useGlobal();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };

    const handleOverlay = (e) => {
      if (e.target.classList.contains("modal")) {
        setModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOverlay);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOverlay);
    };
  }, []);

  return (
    <div className="modal">
      <div className="modal__container">
        <h2 className="modal__title">{title}</h2>
        <button
          className="modal__close-btn"
          onClick={() => setModalOpen(false)}
        />
        {children}
      </div>
    </div>
  );
};
export default Modal;
