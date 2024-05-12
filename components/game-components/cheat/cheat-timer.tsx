"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";

export function WaitingForCheatTimer() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 1;
                if (newProgress >= 100) {
                    clearInterval(timer);
                }
                return newProgress;
            });
        }, 60);

        return () => clearInterval(timer);
    }, []);

    return <Progress value={progress} />;
}
