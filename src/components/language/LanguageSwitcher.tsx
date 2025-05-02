
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/translations/merge-translations";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Store the language preference in localStorage
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  
  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
      setLanguage(savedLanguage as Language);
    }
  }, [setLanguage]);

  const getLanguageName = (code: Language): string => {
    switch (code) {
      case 'en': return 'English';
      case 'tr': return 'Türkçe';
      default: return code;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9" aria-label="Switch language">
          <Languages className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Switch language</span>
          <span className="absolute h-3 w-3 md:h-4 md:w-4 top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-primary text-[8px] md:text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-accent font-medium' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('tr')}
          className={language === 'tr' ? 'bg-accent font-medium' : ''}
        >
          Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
