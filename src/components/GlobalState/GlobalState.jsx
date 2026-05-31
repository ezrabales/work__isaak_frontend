import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [parts, setParts] = useState([]);
  const [submitTo, setSubmitTo] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        parts,
        setParts,
        submitTo,
        setSubmitTo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
