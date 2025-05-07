import { useParams, Link } from "wouter";
import { usePostsByCategory } from "@/hooks/use-posts";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePostsByCategory(slug);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Category Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The category you're looking for couldn't be found or there was an error loading it.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const { category, posts } = data;
  
  // Pagination logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  return (
    <>
      <Helmet>
        <title>{category.name} | Blogfolio</title>
        <meta name="description" content={category.description || `Articles about ${category.name}`} />
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
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{category.name}</h1>
              {category.description && (
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{category.description}</p>
              )}
            </div>
            
            {/* Posts Grid */}
            {currentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No Posts Found</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  There are no posts in this category yet.
                </p>
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
          
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
