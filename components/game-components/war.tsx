import { GameMessage, GameMessageTypes, GameState } from "@/lib/game-manager";

import React from "react";

interface WarProps {
    gameState: GameState;
}

const War: React.FC<WarProps> = ({ gameState }) => {
    // Your component logic here

    return (
        <div>
            {/* Your component JSX here */}
        </div>
    );
};

export default War;