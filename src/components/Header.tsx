
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-8 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-4 h-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-6 w-6 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center h-full">
        <UserMenu />
      </div>
    </header>
  );
};
