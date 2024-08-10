import { SessionContextProvider } from "@/context/session-context";
import { Session } from "../session";
import Cheat from "./cheat/cheat";

export default function Game() {
  return (
    <SessionContextProvider>
      {/* Both session and cheat need to register to and listen for game events like game started, user joined, user ready, etc.
        The SessionContextProvider provides the context for the session and cheat components to listen to these events. */}
      <Session>
        <Cheat />
      </Session>
    </SessionContextProvider>
  );
}
