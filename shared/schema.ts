import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Post table schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  published: boolean("published").default(true).notNull(),
  author: text("author").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
});

// Post category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// Post tags schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Post-tag relation schema
export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
});

// Comment schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  parentId: integer("parent_id").references(() => comments.id),
});

// Media schema for uploaded files
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Insert schemas
export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertCategorySchema = createInsertSchema(categories)
  .omit({ id: true });

export const insertTagSchema = createInsertSchema(tags)
  .omit({ id: true });

export const insertPostTagSchema = createInsertSchema(postTags)
  .omit({ id: true });

export const insertCommentSchema = createInsertSchema(comments)
  .omit({ id: true, createdAt: true });

export const insertMediaSchema = createInsertSchema(media)
  .omit({ id: true, uploadedAt: true });

// Types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = z.infer<typeof insertPostTagSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
