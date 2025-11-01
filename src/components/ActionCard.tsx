"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  backgroundColorClass: string; // New prop for background color
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick, backgroundColorClass }) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center text-white p-6 rounded-lg shadow-button-3d border border-transparent w-full max-w-xs h-36 text-center transition-all transform hover:scale-105 active:scale-95",
        backgroundColorClass // Apply the specific background color class
      )}
    >
      <Icon className="h-8 w-8 mb-2" />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </Button>
  );
};

export default ActionCard;