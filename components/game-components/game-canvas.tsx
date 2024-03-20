import { Update } from "@/lib/game-manager";
import React, { useEffect } from "react";

interface GameCanvasProps {
  // Add any props you need here
}
// EACH COMPONENT LISTENS TO THE EVENTS THAT ARE RELEVANT TO IT
const GameCanvas: React.FC<GameCanvasProps> = (props) => {
  useEffect(() => {
    function handleGameUpdate(event: any) {
      Update(event);
    }
    document.addEventListener("gameDataUpdate", handleGameUpdate);

    return () => {
      document.removeEventListener("gameDataUpdate", handleGameUpdate);
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

  return (
    <div className=" w-96 h-96 bg-black">
      <h1 className=" text-white"></h1>
    </div>
  );
};

export default GameCanvas;
