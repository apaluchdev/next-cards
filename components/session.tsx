"use client";

import React, { ReactNode, Suspense } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Check, CircleEllipsis, CircleUser } from "lucide-react";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { useSessionContext } from "@/context/session-context";
import { UserReadyMessage } from "@/lib/game-types/message";
import LinkInvite from "./ui/link-invite";
import { SessionStatus } from "@/hooks/use-session";
import { LoadingSpinner } from "./ui/loading-spinner";

interface SessionProps {
    authToken: string;
    children: ReactNode; // ReactNode is used to indicate that children can be any React node
}

export const Session: React.FC<SessionProps> = ({ children, authToken }) => {
    const { session } = useSessionContext();
    const linkURL = session.sessionState?.sessionId
        ? `${process.env.NEXT_PUBLIC_DOMAIN}?id=${session.sessionState?.sessionId}`
        : `${process.env.NEXT_PUBLIC_DOMAIN}`;
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

    const PlayerList: React.FC = () => {
        if (!session.sessionState?.users) return null;

        return (
            <ScrollArea className=" h-36 w-60 rounded-md border shadow-md">
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
                                            <CircleUser className={`${session.sessionState.userId == user.UserId ? "text-blue-600" : "text-slate-600"} w-8`} />
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
                <Button variant="default" onClick={async () => await session.ConnectSession(idQueryParam || "", authToken)}>
                    {idQueryParam && idQueryParam != "null" ? "Join Game" : "Create Game"}
                </Button>
                <h1 className="mt-6 font-bold text-red-600 text-xl">{session?.sessionState?.errorMsg && session?.sessionState?.errorMsg}</h1>
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col gap-4 items-center w-full">
                {/* Disconnected */}
                {sessionStatus == SessionStatus.DISCONNECTED && (
                    <Suspense>
                        <ConnectButton />
                    </Suspense>
                )}

                {/* Waiting for players */}
                {sessionStatus == SessionStatus.WAITING_FOR_PLAYERS && (
                    <div className="flex flex-col justify-center gap-12">
                        <div className="flex flex-col gap-2 pl-6 pr-6 pt-4 pb-4 shadow-lg rounded-md">
                            <div className="flex flex-row items-start gap-6">
                                <LinkInvite url={linkURL} />
                                <PlayerList />
                            </div>
                            <ReadyUpButton />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-4">
                            <h1 className="tracking-tighter text-2xl">Waiting for players</h1>
                            <LoadingSpinner size={52} />
                        </div>
                    </div>
                )}

                {sessionStatus == SessionStatus.GAME_STARTED && (
                    <div className="self-end">
                        <PlayerList />
                    </div>
                )}

                {/* Cheat Game Display */}
                {/* Must be loaded so it can subscribe to the session context and listen to the game started message */}
                {children}
            </div>
        </div>
    );
};
