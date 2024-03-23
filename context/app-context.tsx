"use client";

import { createContext, useContext, useState } from "react";

type UserGameData = {
  name: string | undefined;
  score: number | undefined;
  session: string | undefined;
};

type AppContext = {
  state: UserGameData | null;
  setState: React.Dispatch<React.SetStateAction<UserGameData | null>>;
};

export const AppContext = createContext<AppContext | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<UserGameData | null>({
    name: "",
    score: 0,
    session: "",
  }); // Update the type of setState
  return (
    <AppContext.Provider value={{ state, setState }}>
      {" "}
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
