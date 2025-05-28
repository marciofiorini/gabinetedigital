
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar demandas, líderes, eventos..."
            className="w-80 pl-10"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-4 mr-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">47</p>
            <p className="text-xs text-gray-600">Demandas</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">18</p>
            <p className="text-xs text-gray-600">Grupos</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">234</p>
            <p className="text-xs text-gray-600">Líderes</p>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">PL</span>
        </div>
      </div>
    </header>
  );
};
