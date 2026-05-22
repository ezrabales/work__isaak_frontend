import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{ modalOpen, setModalOpen }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
