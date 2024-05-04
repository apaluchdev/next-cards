import React, { ReactNode, Suspense } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Check, CircleEllipsis, CircleUser } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionContext } from "@/context/session-context";
import { UserReadyMessage } from "@/lib/game-types/message";
import LinkInvite from "./ui/link-invite";
import Image from "next/image";
import { SessionStatus } from "@/hooks/use-session";

interface SessionProps {
  children: ReactNode; // ReactNode is used to indicate that children can be any React node
}

export const Session: React.FC<SessionProps> = ({ children }) => {
  const router = useRouter();
  const { session } = useSessionContext();

  const linkURL = session.sessionState?.sessionId ? `localhost:3000?id=${session.sessionState?.sessionId}` : "localhost:3000";
  const { sessionStatus } = session.sessionState;

  const ReadyUpButton: React.FC = () => {
    return (
      <div className="flex justify-end">
        {!session.sessionState.users.find((u) => u.UserId == session.sessionState.userId)?.Ready ? (
          <Button variant="affirmative" onClick={() => session.SendMessage(new UserReadyMessage(session.sessionState.userId, true))}>
            Ready
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => session.SendMessage(new UserReadyMessage(session.sessionState.userId, false))}>
            Cancel
          </Button>
        )}
      </div>
    );
  };

  const Title: React.FC = () => {
    return (
      <div className="mb-6">
        <h1 className="text-center text-6xl tracking-tight ">
          <Link href="/">
            <div className="font-extrabold flex justify-center items-center text-8xl gap-4 text-gray-700">
              <Image src="/go-logo.png" alt="Golang logo" width={200} height={150}></Image>
              <h1>Cards</h1>
            </div>
          </Link>
        </h1>
      </div>
    );
  };

  const PlayerList: React.FC = () => {
    if (!session.sessionState?.users) return null;

    return (
      <ScrollArea className="h-32 w-60 rounded-md border">
        <div className="p-4 flex flex-col gap-2">
          <h4 className="font-bold leading-none">Players</h4>
          <Separator />
          <div>
            {session.sessionState.users
              .filter((user) => user.UserId)
              .map((user) => (
                <div className="text-sm font-medium" key={"div" + user.UserId}>
                  <div className="flex items-center" key={user.UserId}>
                    <div className="flex items-center gap-2 min-w-44">
                      <CircleUser className="w-8" />
                      <p>{user.UserName}</p>
                    </div>
                    {user.Ready ? <Check /> : <CircleEllipsis />}
                  </div>
                  <Separator key={"separator" + user.UserId} className="my-2" />
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>
    );
  };

  const ConnectButton: React.FC = () => {
    const searchParams = useSearchParams();
    const idQueryParam = searchParams.get("id");
    return (
      <div className="flex flex-col items-center justify-center">
        <Button variant="default" onClick={() => session.ConnectSession(idQueryParam || "")}>
          {idQueryParam && idQueryParam != "null" ? "Join Game" : "Create Game"}
        </Button>
        <h1 className="mt-6 font-bold text-red-600 text-xl">{session?.sessionState?.errorMsg && session?.sessionState?.errorMsg}</h1>
      </div>
    );
  };

  return (
    <div>
      <Title />
      <div className="flex flex-col gap-8 items-center w-full">
        {/* Disconnected */}
        {sessionStatus == SessionStatus.DISCONNECTED && (
          <Suspense>
            <ConnectButton />
          </Suspense>
        )}

        {/* Waiting for players */}
        {sessionStatus == SessionStatus.WAITING_FOR_PLAYERS && (
          <div className="flex flex-col gap-2 border-2 pl-6 pr-6 pt-4 pb-4 shadow-lg rounded-md">
            <div className="flex flex-row items-start gap-6">
              <LinkInvite url={linkURL} />
              <PlayerList />
            </div>
            <ReadyUpButton />
          </div>
        )}

        {children}
        {/* Game Started */}
        {/* {sessionStatus == SessionStatus.GAME_STARTED && <div className="flex flex-col gap-4 min-w-[800px] items-center"></div>} */}
      </div>
    </div>
  );
};
