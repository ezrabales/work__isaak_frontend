import { useEffect, useState } from "react";
import "./Modal.css";
import { useGlobal } from "../GlobalState/GlobalState";

const Modal = ({ children, title, backTo = false, scrollY = true }) => {
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
        <h2 className={`${backTo ? "modal__title_with-back" : "modal__title"}`}>
          {title}
        </h2>
        <button
          className="modal__close-btn"
          onClick={() => setModalOpen(false)}
        />
        {backTo && <button className="modal__back-btn" onClick={backTo} />}

        <div
          className={`modal__children-container ${scrollY ? "modal__children-container_scroll-y" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
