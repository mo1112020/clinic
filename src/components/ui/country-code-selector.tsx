
import React, { useState } from 'react';
import { Check, ChevronDown, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

// Common country codes with flags
export const countries: Country[] = [
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', dialCode: '+90' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', dialCode: '+39' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', dialCode: '+34' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', dialCode: '+7' },
  { name: 'China', code: 'CN', flag: '🇨🇳', dialCode: '+86' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', dialCode: '+81' },
  { name: 'India', code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', dialCode: '+55' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (country: Country) => void;
  className?: string;
}

export function CountryCodeSelector({ value, onChange, className }: CountryCodeSelectorProps) {
  const selectedCountry = countries.find(country => country.dialCode === value) || countries[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-1 px-2 py-0 h-10 text-left font-normal ${className}`}
          type="button"
        >
          <span className="mr-1">{selectedCountry.flag}</span>
          <span className="hidden md:inline">{selectedCountry.dialCode}</span>
          <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[300px] overflow-y-auto w-[200px]" align="start">
        {countries.map(country => (
          <DropdownMenuItem
            key={country.code}
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={() => onChange(country)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{country.flag}</span>
              <span>{country.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{country.dialCode}</span>
            {country.dialCode === selectedCountry.dialCode && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
