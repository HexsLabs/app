'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from 'lucide-react';

export const Header = () => {
  const [selected, setSelected] = useState('Provider');

  const options = [
    'Provider',
    'Fizz'
  ];

  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-black text-white border-0 flex items-center gap-2 font-medium"
            >
              {selected}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-black text-white">
            {options.map((option) => (
              <DropdownMenuItem
                key={option}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelected(option)}
              >
                {option}
                {selected === option && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
          Connect to Wallet
        </Button>
      </div>
    </div>
  );
};

export default Header;