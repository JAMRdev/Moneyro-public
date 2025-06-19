import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMoneyVisibility } from "@/contexts/MoneyVisibilityContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const MoneyToggle = () => {
  const { isMoneyVisible, toggleMoneyVisibility } = useMoneyVisibility();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMoneyVisibility}
            className="h-9 w-9"
          >
            {isMoneyVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isMoneyVisible ? "Ocultar valores" : "Mostrar valores"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMoneyVisible ? "Ocultar valores" : "Mostrar valores"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};