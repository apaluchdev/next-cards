"use client";

import { CardHand } from "@/components/game-components/card-hand";
import Cheat from "@/components/game-components/cheat/cheat";
import { Session } from "@/components/session";
import { useSessionContext } from "@/context/session-context";
import { MockCards } from "@/lib/game-types/card-helper";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    const Title: React.FC = () => {
        return (
            <div className="mb-6 w-full">
                <h1 className="text-center text-6xl tracking-tight ">
                    <Link href="/">
                        <div className="font-extrabold flex justify-center items-center text-8xl gap-4 text-gray-700">
                            <Image src="/go-logo.png" alt="Golang logo" width={200} height={150}></Image>
                            <h1 className="tracking-tighter font-extrabold">CHEAT</h1>
                        </div>
                    </Link>
                </h1>
            </div>
        );
    };

    return (
        <main className="flex min-h-screen flex-col items-center flex-start p-4 bg-slate-50">
            <Title />
            <Session>
                <Cheat />
            </Session>
            {/* <CardHand playingCards={MockCards} isViewOnly={false} canSelect={true} cardsSelectedCallback={() => console.log("Cards Selected")} /> */}
        </main>
    );
}
