import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryList from "@/components/category-list";
import { Tag, Post } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Tag as TagIcon } from "lucide-react";

const Sidebar = () => {
  // Get recent posts for sidebar
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
  });
  
  // Get all tags
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["/api/tags"],
  });
  
  const recentPosts = posts?.slice(0, 3) || [];
  
  return (
    <div className="space-y-8">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("search") as string;
              if (query?.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }
            }}
            className="flex space-x-2"
          >
            <Input 
              type="text" 
              name="search" 
              placeholder="Search posts..." 
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Categories */}
      <CategoryList />
      
      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {tagsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          ) : tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: Tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <a className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1 rounded-full text-sm flex items-center">
                    <TagIcon size={12} className="mr-1" />
                    {tag.name}
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400 text-center py-2">No tags found</p>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {postsLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </>
          ) : recentPosts.length > 0 ? (
            <>
              {recentPosts.map((post: Post) => (
                <Link key={post.id} href={`/post/${post.slug}`}>
                  <a className="flex space-x-3 group">
                    <img
                      src={post.coverImage || "https://placehold.co/100x100/EEE/999?text=No+Image"}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
              
              <Link href="/" className="text-primary hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                View All Posts →
              </Link>
            </>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400 text-center py-2">No recent posts</p>
          )}
        </CardContent>
      </Card>
      
      {/* Newsletter */}
      <Card className="bg-primary/5 dark:bg-primary/10">
        <CardHeader>
          <CardTitle>Subscribe to Our Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
            Get the latest posts delivered right to your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Newsletter subscription would be implemented here");
            }}
            className="space-y-3"
          >
            <Input
              type="email"
              placeholder="Your email address"
              required
            />
            <Button type="submit" className="w-full bg-primary hover:bg-blue-600">
              Subscribe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
