"use client";

import { SessionState } from "@/hooks/use-session";
import { SessionMessage } from "@/lib/game-types/message";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContext = {
  messageQueue: SessionMessage[];
  sessionContext: SessionState;
  publishMessage: (newMsg: SessionMessage) => void;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (subscriber: Function) => void;
  setSessionContext: (sessionContext: SessionState) => void;
};

export const SessionContext = createContext<SessionContext | null>(null);

// TODO - maybe this should just use the use-session hook directly, and eliminate the need for an expo
export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageQueue, setMessageQueue] = useState<SessionMessage[]>([]); // Update the type of setState
  const [subscribers, setSubscribers] = useState<Function[]>([]);
  const [sessionContext, setSessionContext] = useState<SessionState>(
    {} as SessionState
  );

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
    <SessionContext.Provider
      value={{
        messageQueue,
        sessionContext,
        publishMessage,
        subscribe,
        unsubscribe,
        setSessionContext,
      }}
    >
      {" "}
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useSessionContext must be used within a SessionContextProvider"
    );
  }
  return context;
}
