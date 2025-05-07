import { useState, useEffect } from "react";
import { useSearchPosts } from "@/hooks/use-posts";
import { Helmet } from "react-helmet";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/search-bar";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { ChevronLeft, Search, AlertCircle } from "lucide-react";

const SearchPage = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Reset pagination when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  
  const { data: posts, isLoading, error } = useSearchPosts(query);
  
  // Pagination logic
  const totalPosts = posts?.length || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost) || [];
  
  return (
    <>
      <Helmet>
        <title>Search Results: {query} | Blogfolio</title>
        <meta name="description" content={`Search results for "${query}" on Blogfolio`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Search Results
              </h1>
              
              {/* Search Form */}
              <div className="mb-8">
                <SearchBar initialQuery={query} />
              </div>
              
              {/* Results Summary */}
              {!isLoading && posts && (
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Found {posts.length} {posts.length === 1 ? 'result' : 'results'} for "{query}"
                </p>
              )}
              
              {/* Loading State */}
              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-64 w-full rounded-xl" />
                  ))}
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-300">Error searching posts</h3>
                    <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                      There was a problem with your search. Please try again.
                    </p>
                  </div>
                </div>
              )}
              
              {/* No Results */}
              {!isLoading && posts?.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <Search className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Results Found</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                    We couldn't find any posts matching "{query}". Try using different keywords or check your spelling.
                  </p>
                </div>
              )}
              
              {/* Results */}
              {!isLoading && posts && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
