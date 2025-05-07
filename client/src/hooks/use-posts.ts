import { useQuery } from "@tanstack/react-query";
import { Post, Tag, Category, Comment } from "@shared/schema";

// Hook for fetching all posts
export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
}

// Hook for fetching a single post by slug
export function usePost(slug: string) {
  return useQuery<{ post: Post, tags: Tag[], comments: Comment[] }>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });
}

// Hook for fetching posts by category
export function usePostsByCategory(slug: string) {
  return useQuery<{ category: Category, posts: Post[] }>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });
}

// Hook for fetching posts by tag
export function usePostsByTag(slug: string) {
  return useQuery<{ tag: Tag, posts: Post[] }>({
    queryKey: [`/api/tags/${slug}`],
    enabled: !!slug,
  });
}

// Hook for searching posts
export function useSearchPosts(query: string) {
  return useQuery<Post[]>({
    queryKey: [`/api/search`, query],
    enabled: !!query,
  });
}
