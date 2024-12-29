import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search for restaurants or dishes"
          className="pl-10"
        />
      </div>
    </div>
  );
};
