
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { AdvancedFilters, type FilterOptions } from "@/components/AdvancedFilters";

interface CrmFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
  onClearFilters?: () => void;
  showAdvanced?: boolean;
}

export const CrmFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters,
  onFiltersChange,
  onClearFilters,
  showAdvanced = false 
}: CrmFiltersProps) => {
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-indigo-500 transition-colors"
              />
            </div>
            <Button variant="outline" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showAdvanced && filters && onFiltersChange && onClearFilters && (
        <AdvancedFilters
          type="leads"
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClearFilters={onClearFilters}
        />
      )}
    </div>
  );
};
