
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
          <span className="absolute h-4 w-4 top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('tr')}>
          Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
