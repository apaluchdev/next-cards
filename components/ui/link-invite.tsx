import React, { useRef } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { CopyTextButton } from "./copy-text-button";

interface LinkInviteProps {
  url: string;
}

const LinkInvite: React.FC<LinkInviteProps> = ({ url }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 tracking-tight">
      <div className="grid flex-1 gap-2">
        <div>
          <h1 className="text-xl font-medium">Invite Players</h1>
          <p className="text-sm">
            Other players can join your session with this link
          </p>
        </div>
        <div></div>
        <Label htmlFor="link" className="sr-only">
          {url}
        </Label>
        <div onClick={handleButtonClick} className="flex gap-2 items-center">
          <Input ref={inputRef} id="link" defaultValue={url || ""} readOnly />
          <CopyTextButton link={url || ""}></CopyTextButton>
        </div>
      </div>
    </div>
  );
};

export default LinkInvite;
