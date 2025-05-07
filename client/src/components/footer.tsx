import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
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
              <span className="font-bold text-xl">Blogfolio</span>
            </Link>
            <p className="mt-4 text-neutral-400 max-w-md">
              A modern blogging platform for developers and creatives to share their knowledge and insights with the world.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/programming" className="text-neutral-400 hover:text-white">
                  Programming
                </Link>
              </li>
              <li>
                <Link href="/category/web-development" className="text-neutral-400 hover:text-white">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/category/design" className="text-neutral-400 hover:text-white">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/category/devops" className="text-neutral-400 hover:text-white">
                  DevOps
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-neutral-400 hover:text-white">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-neutral-400 hover:text-white">
                  Search
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} Blogfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
