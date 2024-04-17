"use client";

import { User } from "@/lib/game-types/user";
import { createContext, useContext, useState } from "react";

type AppContext = {
  state: SessionState2;
  setState: React.Dispatch<React.SetStateAction<SessionState2>>;
};

export type SessionState2 = {
  users: User[];
  sessionId: string;
  connected: boolean;
  userId: string;
  fruit: string;
};

export const AppContext = createContext<AppContext | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sesState, setSesState] = useState<SessionState2>({
    users: [],
    sessionId: "",
    connected: false,
    userId: "",
    fruit: "apple",
  }); // Update the type of setState
  return (
    <AppContext.Provider value={{ state: sesState, setState: setSesState }}>
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
