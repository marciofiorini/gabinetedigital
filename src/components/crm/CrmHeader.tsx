
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CrmHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          CRM - Pipeline
        </h1>
        <p className="text-gray-600">
          Acompanhe o funil de conversão dos seus leads
        </p>
      </div>
      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
        <Plus className="w-4 h-4 mr-2" />
        Novo Lead
      </Button>
    </div>
  );
};
