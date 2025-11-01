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
  backgroundColorClass: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, onClick, backgroundColorClass }) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center text-white p-6 rounded-lg shadow-button-3d border border-transparent w-full max-w-sm h-48 text-center transition-all transform hover:scale-105 active:scale-95",
        backgroundColorClass
      )}
    >
      <Icon className="h-10 w-10 mb-2" /> {/* Increased icon size */}
      <h3 className="text-xl font-semibold mb-1">{title}</h3> {/* Increased title font size */}
      <p className="text-base opacity-90 h-[3rem] flex items-center justify-center">{description}</p> {/* Increased description font size and height */}
    </Button>
  );
};

export default ActionCard;