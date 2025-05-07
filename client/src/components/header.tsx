import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import SearchBar from "@/components/search-bar";
import { Menu, X, Sun, Moon } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="#0070F3" />
                <path d="M8 8H24V12H16V24H8V8Z" fill="white" />
                <path d="M16 16H24V24H16V16Z" fill="white" />
              </svg>
              <span className="font-bold text-xl text-neutral-900 dark:text-white">Blogfolio</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`px-3 py-2 font-medium ${location === '/' ? 'text-primary' : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary'}`}>
              Home
            </Link>
            <Link href="/category/programming" className={`px-3 py-2 font-medium ${location.startsWith('/category/programming') ? 'text-primary' : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary'}`}>
              Programming
            </Link>
            <Link href="/category/web-development" className={`px-3 py-2 font-medium ${location.startsWith('/category/web-development') ? 'text-primary' : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary'}`}>
              Web Dev
            </Link>
            <Link href="/category/design" className={`px-3 py-2 font-medium ${location.startsWith('/category/design') ? 'text-primary' : 'text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary'}`}>
              Design
            </Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Link href="/search">
              <Button variant="ghost" size="icon" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>
            </Link>
            <Link href="/write">
              <Button className="bg-primary hover:bg-blue-600 text-white">
                Write Post
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 rounded-md font-medium ${location === '/' ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}>
              Home
            </Link>
            <Link href="/category/programming" className={`block px-3 py-2 rounded-md font-medium ${location.startsWith('/category/programming') ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}>
              Programming
            </Link>
            <Link href="/category/web-development" className={`block px-3 py-2 rounded-md font-medium ${location.startsWith('/category/web-development') ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}>
              Web Development
            </Link>
            <Link href="/category/design" className={`block px-3 py-2 rounded-md font-medium ${location.startsWith('/category/design') ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}>
              Design
            </Link>
            <Link href="/write" className={`block px-3 py-2 rounded-md font-medium ${location === '/write' ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}>
              Write Post
            </Link>
          </div>
        </div>
      )}
      
      {/* Mobile Search */}
      <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <SearchBar mobile={true} />
      </div>
    </header>
  );
};

export default Header;
