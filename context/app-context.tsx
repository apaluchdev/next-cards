"use client";

import { createContext, useContext, useState } from "react";

type UserGameData = {
  name: string;
  score: number;
  session: string;
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
    name: "John",
    score: 0,
    session: "1234",
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
