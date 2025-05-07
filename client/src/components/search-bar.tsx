import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  mobile?: boolean;
  initialQuery?: string;
}

const SearchBar = ({ mobile = false, initialQuery = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [_, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`flex items-center ${mobile ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-900'} rounded-md ${mobile ? 'px-3 py-2' : ''}`}>
        {mobile && <SearchIcon className="text-neutral-500 dark:text-neutral-400 mr-2" size={18} />}
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 ${mobile ? 'bg-transparent border-none shadow-none px-0 py-0' : ''}`}
        />
        {!mobile && (
          <Button type="submit" size="sm" className="ml-2">
            <SearchIcon size={18} className="mr-2" />
            Search
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
