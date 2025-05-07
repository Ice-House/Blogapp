import { useParams } from "wouter";
import { usePost } from "@/hooks/use-posts";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CommentSection from "@/components/comment-section";
import Sidebar from "@/components/sidebar";
import { CalendarIcon, Clock, UserCircle, ChevronLeft, Tag as TagIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { useEffect } from "react";
import { renderMarkdown } from "@/lib/markdown";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePost(slug);
  
  // Scroll to top when post loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Cover Image Skeleton */}
            <Skeleton className="w-full aspect-video rounded-lg" />
            
            {/* Title Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
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
            Failed to load post
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The post you're looking for couldn't be found or there was an error loading it.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const { post, tags, comments } = data;
  
  return (
    <>
      <Helmet>
        <title>{post.title} | Blogfolio</title>
        <meta name="description" content={post.excerpt || `Read ${post.title} on Blogfolio`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || `Read ${post.title} on Blogfolio`} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
            
            {/* Cover Image */}
            {post.coverImage && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            )}
            
            {/* Post Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center mt-4 space-x-4 text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center">
                  <UserCircle className="mr-1 h-5 w-5" />
                  <span>{post.author}</span>
                </div>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-5 w-5" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              
              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {tags.map(tag => (
                    <Link 
                      key={tag.id} 
                      href={`/tag/${tag.slug}`}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <TagIcon size={12} className="mr-1" />
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Post Content */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div 
                  className="prose prose-blue dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                />
              </CardContent>
            </Card>
            
            {/* Author Bio */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <UserCircle className="h-16 w-16 text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white">{post.author}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Author</p>
                    <p className="mt-2 text-neutral-700 dark:text-neutral-300 text-sm">
                      Content creator and technology enthusiast sharing knowledge and insights on programming and web development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments Section */}
            <CommentSection postId={post.id} comments={comments} />
          </div>
          
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
