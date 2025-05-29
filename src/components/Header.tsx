
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-between px-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      <div className="hidden lg:block w-8" />
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
