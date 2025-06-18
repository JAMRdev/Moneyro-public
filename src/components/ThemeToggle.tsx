
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { logActivity } from "@/lib/logger"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    logActivity({
      action: "Cambio de Tema",
      location: "Header",
      details: { from: theme, to: newTheme },
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
