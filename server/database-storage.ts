import { posts, categories, tags, postTags, comments, media, users,
  type Post, type InsertPost, type Category, type InsertCategory, 
  type Tag, type InsertTag, type PostTag, type InsertPostTag, 
  type Comment, type InsertComment, type Media, type InsertMedia,
  type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, like, and, or, desc, isNull } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return await db.select()
      .from(posts)
      .where(eq(posts.categoryId, categoryId))
      .orderBy(desc(posts.createdAt));
  }

  async getPostsByTag(tagId: number): Promise<Post[]> {
    const postWithTags = await db.select({
      post: posts
    })
    .from(posts)
    .innerJoin(postTags, eq(posts.id, postTags.postId))
    .where(eq(postTags.tagId, tagId))
    .orderBy(desc(posts.createdAt));
    
    return postWithTags.map(pt => pt.post);
  }

  async searchPosts(query: string): Promise<Post[]> {
    const searchTerm = `%${query}%`;
    return await db.select()
      .from(posts)
      .where(
        or(
          like(posts.title, searchTerm),
          like(posts.content, searchTerm),
          like(posts.excerpt, searchTerm)
        )
      )
      .orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const [updatedPost] = await db
      .update(posts)
      .set(post)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    // Delete related post tags first
    await db.delete(postTags).where(eq(postTags.postId, id));
    
    // Delete related comments
    await db.delete(comments).where(eq(comments.postId, id));
    
    // Delete the post
    const [deletedPost] = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    
    return !!deletedPost;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Update posts to remove category reference
    await db
      .update(posts)
      .set({ categoryId: null })
      .where(eq(posts.categoryId, id));
    
    // Delete the category
    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    
    return !!deletedCategory;
  }

  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag;
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  async updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined> {
    const [updatedTag] = await db
      .update(tags)
      .set(tag)
      .where(eq(tags.id, id))
      .returning();
    return updatedTag;
  }

  async deleteTag(id: number): Promise<boolean> {
    // Delete related post tags first
    await db.delete(postTags).where(eq(postTags.tagId, id));
    
    // Delete the tag
    const [deletedTag] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();
    
    return !!deletedTag;
  }

  // PostTag operations
  async getTagsByPostId(postId: number): Promise<Tag[]> {
    const tagsWithPost = await db.select({
      tag: tags
    })
    .from(tags)
    .innerJoin(postTags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, postId));
    
    return tagsWithPost.map(tp => tp.tag);
  }

  async addTagToPost(postTag: InsertPostTag): Promise<PostTag> {
    // Check if relation already exists
    const [existingPostTag] = await db
      .select()
      .from(postTags)
      .where(
        and(
          eq(postTags.postId, postTag.postId),
          eq(postTags.tagId, postTag.tagId)
        )
      );
    
    if (existingPostTag) {
      return existingPostTag;
    }
    
    const [newPostTag] = await db.insert(postTags).values(postTag).returning();
    return newPostTag;
  }

  async removeTagFromPost(postId: number, tagId: number): Promise<boolean> {
    const [deletedPostTag] = await db
      .delete(postTags)
      .where(
        and(
          eq(postTags.postId, postId),
          eq(postTags.tagId, tagId)
        )
      )
      .returning();
    
    return !!deletedPostTag;
  }

  // Comment operations
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const rawComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
    
    return rawComments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      postId: comment.postId,
      userId: comment.userId,
      parentId: comment.parentId ?? null,
      status: comment.status,
      updatedAt: comment.updatedAt,
    }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    const newComment = Array.isArray(result) ? result[0] : undefined;
    if (!newComment) {
      throw new Error("Failed to create comment");
    }
    return newComment;
  }

  async updateComment(id: number, comment: Partial<InsertComment>): Promise<Comment | undefined> {
    const [updatedComment] = await db
      .update(comments)
      .set(comment)
      .where(eq(comments.id, id))
      .returning();
    return updatedComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    // Update child comments to remove parent reference
    await db
      .update(comments)
      .set({ parentId: null })
      .where(eq(comments.parentId, id));
    
    // Delete the comment
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    const deletedComment = Array.isArray(result) ? result[0] : undefined;
    
    return !!deletedComment;
  }

  // Media operations
  async getAllMedia(): Promise<Media[]> {
    return await db.select().from(media).orderBy(desc(media.uploadedAt));
  }

  async getMediaById(id: number): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem;
  }

  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaItem).returning();
    return newMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    const [deletedMedia] = await db
      .delete(media)
      .where(eq(media.id, id))
      .returning();
    
    return !!deletedMedia;
  }

  // User operations
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    // Update posts to remove user reference
    await db
      .update(posts)
      .set({ userId: undefined })
      .where(eq(posts.userId, id));
    
    // Delete the user
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    
    return !!deletedUser;
  }
}



































