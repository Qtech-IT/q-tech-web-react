import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { Search, X } from "lucide-react";
import { useTranslations } from "@/Hooks/useTranslations";


interface CommonSimpleSearchBoxProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  placeholder?: string;
  className?: string;
  onSearchChange: (value: string) => void;
}

/* ------------------------------------------------------------------ */

export const CommonSimpleSearchBox: React.FC<CommonSimpleSearchBoxProps> = ({
  title = "Search Languages",
  description = "Find languages instantly",
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  className = "",
}) => {
  const [localSearch, setLocalSearch] = useState<string>(searchTerm);
  
  const {t} = useTranslations()

  const handleSearchChange = (value: string): void => {
    setLocalSearch(value);
    onSearchChange(value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  const clearSearch = (): void => {
    handleSearchChange("");
  };

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);



  return (
    <div
      className={`w-full max-w-full p-3 space-y-3 border rounded-xl bg-background sm:p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center min-w-0 gap-2">
        <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 sm:p-2">
          <Search className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate sm:text-base">
            {title}
          </h3>
          <p className="text-xs truncate text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute w-3.5 h-3.5 left-2.5 top-2.5 text-muted-foreground sm:w-4 sm:h-4 sm:left-3 sm:top-3" />

          <Input
            name="search"
            placeholder={placeholder}
            value={localSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            className="w-full pl-8 pr-8 text-sm h-9 sm:pl-9 sm:pr-10 sm:h-10"
          />

          {localSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 w-7 h-7 sm:right-1.5 sm:top-1.5"
              onClick={clearSearch}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Info */}
      {localSearch && (
        <div className="pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            {t('Searching for')}:{" "}
            <span className="font-medium text-foreground">
              "{localSearch}"
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default CommonSimpleSearchBox;
