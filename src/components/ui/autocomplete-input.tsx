
import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteInput = ({
  suggestions,
  value,
  onChange,
  onBlur,
  placeholder,
  className
}: AutocompleteInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
  );

  useEffect(() => {
    setSelectedIndex(-1);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          onChange(filteredSuggestions[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 150);
          onBlur?.();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                index === selectedIndex && "bg-muted"
              )}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
