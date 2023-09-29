import { createContext, useState } from "react";

export const AppContext = createContext()

export function AppProvider({ children }) {

  const [user, setUser] = useState()

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}