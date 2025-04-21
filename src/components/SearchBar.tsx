import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  isLoading: boolean;
}

const SearchBar = ({ 
  onSearch, 
  className = "", 
  placeholder = "Try 'Interstellar but funnier' or 'Something like The Godfather but set in modern times'", 
  isLoading
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center space-x-2 ${className}`}>
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 bg-background/70 border-muted backdrop-blur-sm focus-visible:ring-primary"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="bg-primary hover:bg-primary/90"
      >
        {isLoading ? "Searching..." : "Find Movies"}
      </Button>
    </form>
  );
};

export default SearchBar;
