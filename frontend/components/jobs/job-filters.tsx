import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


export function JobFilters({
    platforms = [], // Default empty array for platforms
    selectedPlatforms = [], // Default empty array for selected platforms
    onPlatformChange,
  }: {
    platforms: string[];
    selectedPlatforms?: string[]; // Optional prop to avoid issues
    onPlatformChange: (selected: string[]) => void;
  }) {
    const [open, setOpen] = useState(false);
  
    const togglePlatform = (platform: string) => {
      const updatedPlatforms = selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter((p) => p !== platform)
        : [...selectedPlatforms, platform];
      onPlatformChange(updatedPlatforms);
    };
  
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
              {selectedPlatforms.length > 0
                ? `${selectedPlatforms.length} selected`
                : "Select platforms"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search platforms..." />
              {platforms.length === 0 && (
                <CommandItem onSelect={() => setOpen(false)}>No platform found.</CommandItem>
              )}
              {platforms.map((platform) => (
                <CommandItem key={platform} onSelect={() => togglePlatform(platform)}>
                  <span
                    className={`mr-2 h-4 w-4 ${
                      selectedPlatforms.includes(platform) ? "text-blue-500" : "opacity-50"
                    }`}
                  >
                    {selectedPlatforms.includes(platform) ? "✓" : ""}
                  </span>
                  {platform}
                </CommandItem>
              ))}
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-1">
          {selectedPlatforms.map((platform) => (
            <span
              key={platform}
              className="bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
              onClick={() => togglePlatform(platform)}
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    );
  }
  