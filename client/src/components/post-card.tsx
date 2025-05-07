import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Post, Tag } from "@shared/schema";
import { CalendarIcon, Clock, UserCircle } from "lucide-react";

interface PostCardProps {
  post: Post;
  tags?: Tag[];
  variant?: "default" | "featured";
}

const PostCard = ({ post, tags = [], variant = "default" }: PostCardProps) => {
  const isFeatured = variant === "featured";
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isFeatured ? 'lg:flex' : ''}`}>
      <div className={`${isFeatured ? 'lg:w-1/2 h-auto' : 'h-48'}`}>
        <Link href={`/post/${post.slug}`}>
          <img 
            src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&h=450&q=80"} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </Link>
      </div>
      <CardContent className={`p-6 ${isFeatured ? 'lg:w-1/2' : ''}`}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {tags.map(tag => (
            <Link 
              key={tag.id} 
              href={`/tag/${tag.slug}`}
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs px-2 py-1 rounded-full"
            >
              {tag.name}
            </Link>
          ))}
          <span className="text-neutral-500 dark:text-neutral-400 text-sm">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <Link href={`/post/${post.slug}`}>
          <h3 className={`font-bold text-neutral-900 dark:text-neutral-100 hover:text-primary dark:hover:text-primary transition-colors ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h3>
        </Link>
        
        {post.excerpt && (
          <p className="text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center text-sm">
            <UserCircle size={18} className="mr-1 text-neutral-500" />
            <span className="text-neutral-700 dark:text-neutral-300">{post.author}</span>
          </div>
        </div>
        
        {isFeatured && (
          <Link 
            href={`/post/${post.slug}`}
            className="inline-block mt-4 text-primary hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Read More →
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
