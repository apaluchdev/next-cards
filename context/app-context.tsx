"use client";

import { SessionMessage } from "@/lib/game-types/message";
import { User } from "@/lib/game-types/user";
import { createContext, useContext, useEffect, useState } from "react";

type AppContext = {
  messageQueue: SessionMessage[];
  publishMessage: (newMsg: SessionMessage) => void;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (subscriber: Function) => void;
};

export const AppContext = createContext<AppContext | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageQueue, setMessageQueue] = useState<SessionMessage[]>([]); // Update the type of setState
  const [subscribers, setSubscribers] = useState<Function[]>([]);

  const subscribe = (subscriber: Function) => {
    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  };

  const unsubscribe = (subscriber: Function) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== subscriber)
    );
  };

  const publishMessage = (newMsg: SessionMessage) => {
    setMessageQueue((prevMsgs) => [...prevMsgs, newMsg]);
  };

  useEffect(() => {
    if (messageQueue.length > 0) {
      var msg = messageQueue[0];
      setMessageQueue((prevMsgs) => prevMsgs.slice(1));
      subscribers.forEach((subscriber) => subscriber(msg));
    }
  }, [messageQueue, subscribers]);

  return (
    <AppContext.Provider
      value={{ messageQueue, publishMessage, subscribe, unsubscribe }}
    >
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
