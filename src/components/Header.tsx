
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="hidden lg:flex"
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      <div className="lg:hidden w-8" />
      
      <UserMenu />
    </header>
  );
};
