import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [parts, setParts] = useState([]);

  return (
    <GlobalContext.Provider
      value={{ modalOpen, setModalOpen, parts, setParts }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
