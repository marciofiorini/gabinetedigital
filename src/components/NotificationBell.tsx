
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotificationBell = () => {
  return (
    <Button variant="outline" size="icon" className="relative">
      <Bell className="h-4 w-4" />
    </Button>
  );
};
