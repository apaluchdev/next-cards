import { CopyIcon } from "lucide-react";
import { Toaster } from "./toaster";
import { useToast } from "./use-toast";
import { Button } from "./button";

function CopyTextButton({ link }: { link: string }) {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);

    toast({
      title: "Copied to Clipboard",
      description: `${link}`,
    });
  };

  return (
    <div>
      <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
        <span className="sr-only">Copy</span>
        <CopyIcon className="h-4 w-4" />
      </Button>
      <Toaster></Toaster>
    </div>
  );
}

export { CopyTextButton };
