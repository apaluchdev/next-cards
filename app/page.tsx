"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LinkInvite from "@/components/ui/link-invite";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Check, CircleEllipsis, CircleUser, Delete } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { UserReadyMessage } from "@/lib/game-types/message";
import Cheat from "@/components/game-components/cheat/cheat";
import { useAppContext } from "@/context/app-context";

export default function Home() {
  //const { state: sesState, setState: setSesState } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const session = useSession();

  const idQueryParam = searchParams.get("id");
  //   router.push(`?id=${gamesessionState.sessionUuid}`, {
  //     scroll: false,
  //   });

  const linkURL = session.sessionState?.sessionId
    ? `localhost:3000?id=${session.sessionState?.sessionId}` // TODO this should be the url param
    : "localhost:3000";

  const handleDisconnect = () => {
    session.DisconnectSession();
    router.push(`/`, {
      scroll: false,
    });
  };

  const ConnectionInfo: React.FC = () => {
    return (
      <div className="flex flex-row items-center gap-6">
        {session.sessionState?.sessionId && <LinkInvite url={linkURL} />}
        <PlayerList />
      </div>
    );
  };

  const SessionInfo: React.FC = () => {
    return (
      <div className="flex gap-6">
        <Button variant="destructive" onClick={handleDisconnect}>
          Disconnect
        </Button>
        {!session.sessionState.users.find(
          (u) => u.UserId == session.sessionState.userId
        )?.Ready ? (
          <Button
            variant="affirmative"
            onClick={() =>
              session.SendMessage(
                new UserReadyMessage(session.sessionState.userId, true)
              )
            }
          >
            Ready
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() =>
              session.SendMessage(
                new UserReadyMessage(session.sessionState.userId, false)
              )
            }
          >
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
          <div className="font-extrabold flex justify-center items-center text-8xl gap-4 text-gray-700">
            <Image
              src="/go-logo.png"
              alt="Golang logo"
              width={200}
              height={150}
            ></Image>
            <h1>Cards</h1>
          </div>
        </h1>
      </div>
    );
  };

  const PlayerList: React.FC = () => {
    if (!session.sessionState?.users) return null;

    return (
      <ScrollArea className="h-28 w-60 rounded-md border">
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

  return (
    <main className="flex min-h-screen flex-col items-center flex-start p-6">
      <Title />
      <div className="flex flex-col gap-8 items-center w-full">
        {!session.sessionState.connected && (
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={() => session.ConnectSession(idQueryParam || "")}
            >
              {idQueryParam && idQueryParam != "null"
                ? "Join Game"
                : "Create Game"}
            </Button>
          </div>
        )}
        {session.sessionState.connected && (
          <div>
            <ConnectionInfo />
            <SessionInfo />
            <Cheat Session={{ ...session }} />
          </div>
        )}
      </div>
    </main>
  );
}
