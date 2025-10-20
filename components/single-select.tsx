"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

interface SingleSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}


export function SingleSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  disabled
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (val: string) => {
    if (value === val) onValueChange("");
    else onValueChange(val);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {value ? (
              <Badge variant="secondary">
                {options.find((v) => v.value === value)?.label?.toUpperCase()}
              </Badge>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search..." disabled={disabled} />{" "}
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => !disabled && toggleOption(opt.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  {opt.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
