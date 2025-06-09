
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-8 w-8 p-0 flex items-center justify-center shrink-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {!isMobile && <GlobalSearch />}
        </div>
      </div>
      
      <div className="flex items-center gap-1 lg:gap-2 shrink-0">
        {isMobile && (
          <div className="max-w-[200px]">
            <GlobalSearch />
          </div>
        )}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
