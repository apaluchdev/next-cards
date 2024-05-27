import { SessionContextProvider } from "@/context/session-context";
import { Session } from "../session";
import Cheat from "./cheat/cheat";
import { cookies } from "next/headers";

export default function Game() {
    const authCookie = cookies().get("authorization");
    return (
        <SessionContextProvider>
            <Session authToken={authCookie?.value ?? ""}>
                <Cheat />
            </Session>
        </SessionContextProvider>
    );
}
