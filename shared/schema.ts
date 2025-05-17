import { pgTable, text, serial, integer, timestamp, boolean, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Post category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
  published: boolean("published").default(false).notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
});

// Post tags schema
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post-tag relation schema
export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comment schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  parentId: integer("parent_id").references((): number => comments.id),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
});

// Media schema
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  altText: text("alt_text"),
});

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  profileImage: text("profile_image"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  lastLogin: timestamp("last_login"),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  }),
  author: one(users, {
    fields: [posts.userId],
    references: [users.id]
  }),
  comments: many(comments),
  postTags: many(postTags)
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags)
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id]
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id]
  })
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id]
  }),
  replies: many(comments)
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  media: many(media)
}));

// Zod validation schemas
export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertTagSchema = createInsertSchema(tags)
  .omit({ id: true, createdAt: true });

export const insertPostTagSchema = createInsertSchema(postTags)
  .omit({ id: true, createdAt: true });

export const insertCommentSchema = createInsertSchema(comments)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertMediaSchema = createInsertSchema(media)
  .omit({ id: true, uploadedAt: true });

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true, role: true });

// Auth schemas with enhanced validation
export const userRegistrationSchema = insertUserSchema
  .extend({
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
    email: z.string().email("Invalid email format"),
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const userLoginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required").max(100),
  rememberMe: z.boolean().optional().default(false)
});

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
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
































































































































































