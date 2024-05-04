"use client";

import { Session, useSession } from "@/hooks/use-session";
import { SessionMessage } from "@/lib/game-types/message";
import { createContext, useContext, useEffect, useState } from "react";

// Wraps a session and provides components with the ability to subscribe to changes in the session
type SessionContext = {
  session: Session;
  subscribe: (subscriber: Function) => void;
  unsubscribe: (subscriber: Function) => void;
};

export const SessionContext = createContext<SessionContext | null>(null);

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [messageQueue, setMessageQueue] = useState<SessionMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Function[]>([]);

  // Subscribe to changes in the session
  const subscribe = (subscriber: Function) => {
    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  };

  // Unsubscribe from changes in the session
  const unsubscribe = (subscriber: Function) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== subscriber));
  };

  // Publish a message to the message queue
  const publishMessage = (newMsg: SessionMessage) => {
    setMessageQueue((prevMsgs) => [...prevMsgs, newMsg]);
  };

  // Whenever a message is added to the message queue, publish it to all subscribers
  useEffect(() => {
    if (messageQueue.length > 0) {
      var msg = messageQueue[0];
      setMessageQueue((prevMsgs) => prevMsgs.slice(1));
      subscribers.forEach((subscriber) => subscriber(msg, session));
    }
  }, [messageQueue, subscribers]);

  // Maintain a session state
  const session = useSession(publishMessage);

  return (
    <SessionContext.Provider
      value={{
        session,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContextProvider");
  }
  return context;
}
