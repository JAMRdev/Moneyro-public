import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMoneyVisibility } from "@/contexts/MoneyVisibilityContext";

export const MoneyToggle = () => {
  const { isMoneyVisible, toggleMoneyVisibility } = useMoneyVisibility();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMoneyVisibility}
    >
      <Eye className={`h-[1.2rem] w-[1.2rem] transition-all ${isMoneyVisible ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      <EyeOff className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${!isMoneyVisible ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      <span className="sr-only">
        {isMoneyVisible ? "Ocultar valores" : "Mostrar valores"}
      </span>
    </Button>
  );
};