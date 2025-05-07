import { useState } from "react";
import { usePosts } from "@/hooks/use-posts";
import { useQuery } from "@tanstack/react-query";
import { Post, Tag } from "@shared/schema";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Home = () => {
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  
  // Fetch all posts
  const { data: posts, isLoading, error } = usePosts();
  
  // Get tags for each post
  const getTagsForPost = (postId: number) => {
    const { data: tags } = useQuery({
      queryKey: [`/api/posts/${postId}/tags`],
      enabled: false,
    });
    
    return tags || [];
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-80 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
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
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Failed to load posts</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Please try again later</p>
        </div>
      </div>
    );
  }
  
  const featuredPost = posts?.[0];
  const totalPages = Math.ceil((posts?.length - 1) / postsPerPage);
  const paginatedPosts = posts?.slice(1).slice((page - 1) * postsPerPage, page * postsPerPage);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&h=400&q=80" 
            alt="Programming workspace" 
            className="object-cover w-full h-full" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl">
            Blogfolio: Share Your Knowledge
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Explore articles on programming, web development, design, and more from talented developers around the world.
          </p>
          <div className="mt-6 flex space-x-4">
            <Button size="lg" className="bg-primary hover:bg-blue-600">
              Start Reading
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Write an Article
            </Button>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Featured Post
                </h2>
                <PostCard 
                  post={featuredPost} 
                  tags={getTagsForPost(featuredPost.id)}
                  variant="featured" 
                />
              </div>
            )}
            
            {/* Recent Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Recent Posts
              </h2>
              
              {paginatedPosts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedPosts.map((post: Post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      tags={getTagsForPost(post.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-600 dark:text-neutral-400">No posts found</p>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
