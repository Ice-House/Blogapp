import { 
  Post, InsertPost, 
  Category, InsertCategory, 
  Tag, InsertTag, 
  Comment, InsertComment, 
  Media, InsertMedia, 
  PostTag, InsertPostTag 
} from "@shared/schema";

export interface IStorage {
  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostsByCategory(categoryId: number): Promise<Post[]>;
  getPostsByTag(tagId: number): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tag operations
  getAllTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<boolean>;
  
  // PostTag operations
  getTagsByPostId(postId: number): Promise<Tag[]>;
  addTagToPost(postTag: InsertPostTag): Promise<PostTag>;
  removeTagFromPost(postId: number, tagId: number): Promise<boolean>;
  
  // Comment operations
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, comment: Partial<InsertComment>): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;
  
  // Media operations
  getAllMedia(): Promise<Media[]>;
  getMediaById(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private posts: Map<number, Post>;
  private categories: Map<number, Category>;
  private tags: Map<number, Tag>;
  private postTags: Map<number, PostTag>;
  private comments: Map<number, Comment>;
  private media: Map<number, Media>;
  
  private postId: number;
  private categoryId: number;
  private tagId: number;
  private postTagId: number;
  private commentId: number;
  private mediaId: number;
  
  constructor() {
    this.posts = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.postTags = new Map();
    this.comments = new Map();
    this.media = new Map();
    
    this.postId = 1;
    this.categoryId = 1;
    this.tagId = 1;
    this.postTagId = 1;
    this.commentId = 1;
    this.mediaId = 1;
    
    // Initialize with some default data
    this.initializeDefaultData();
  }
  
  private initializeDefaultData() {
    // Create default categories
    const categories = [
      { name: "Programming", slug: "programming", description: "Programming related content" },
      { name: "Web Development", slug: "web-development", description: "Web development tutorials and tips" },
      { name: "Design", slug: "design", description: "Design inspiration and resources" },
      { name: "DevOps", slug: "devops", description: "DevOps techniques and practices" }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Create default tags
    const tags = [
      { name: "JavaScript", slug: "javascript" },
      { name: "React", slug: "react" },
      { name: "CSS", slug: "css" },
      { name: "Node.js", slug: "nodejs" },
      { name: "Express", slug: "express" },
      { name: "TypeScript", slug: "typescript" },
      { name: "UI/UX", slug: "ui-ux" }
    ];
    
    tags.forEach(tag => this.createTag(tag));
    
    // Create sample blog posts
    const samplePosts = [
      {
        title: "Getting Started with React",
        slug: "getting-started-with-react",
        content: `
# Getting Started with React

React is a JavaScript library for building user interfaces. It's maintained by Facebook and a community of individual developers and companies.

## Why React?

React allows you to build complex UIs from small, isolated pieces of code called components. This makes it easy to develop and maintain your applications.

\`\`\`javascript
import React from 'react';

function HelloWorld() {
  return <h1>Hello, world!</h1>;
}

export default HelloWorld;
\`\`\`

## React Component Lifecycle

Components have a lifecycle that includes mounting, updating, and unmounting phases.

1. **Mounting**: When a component is being created and inserted into the DOM
2. **Updating**: When a component is being re-rendered due to changes in props or state
3. **Unmounting**: When a component is being removed from the DOM

## Hooks

Hooks are a newer addition to React that allow you to use state and other React features without writing a class.

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

This is just the beginning of your React journey!
        `,
        excerpt: "Learn the basics of React and get started with building user interfaces using components and hooks.",
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "Alex Johnson",
        categoryId: 1,
        published: true
      },
      {
        title: "CSS Grid Layout: A Comprehensive Guide",
        slug: "css-grid-layout-comprehensive-guide",
        content: `
# CSS Grid Layout: A Comprehensive Guide

CSS Grid Layout is a powerful tool that allows for two-dimensional layouts to be created on the web.

## Basic Concepts

Grid Layout gives us a way to create grid structures that are described in both CSS and HTML.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Grid Items and Grid Lines

Grid items are the children of the grid container. Grid lines are the dividing lines that make up the structure of the grid.

\`\`\`css
.item {
  grid-column: 1 / 3;  /* Start at grid line 1 and end at grid line 3 */
  grid-row: 1 / 2;     /* Start at grid line 1 and end at grid line 2 */
}
\`\`\`

## Grid Areas

Grid areas are logical cells or regions in your CSS Grid that you can place items into.

\`\`\`css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\`\`\`

This is a powerful way to create responsive layouts!
        `,
        excerpt: "Master CSS Grid Layout with this comprehensive guide. Learn about grid containers, items, lines, and areas to create powerful layouts.",
        coverImage: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "Sarah Chen",
        categoryId: 3,
        published: true
      },
      {
        title: "Introduction to Express.js",
        slug: "introduction-to-expressjs",
        content: `
# Introduction to Express.js

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Getting Started

First, install Express:

\`\`\`bash
npm install express
\`\`\`

Then, create a simple server:

\`\`\`javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}/\`);
});
\`\`\`

## Routing

Express provides a way to respond to HTTP methods with routes:

\`\`\`javascript
// GET method route
app.get('/users', (req, res) => {
  res.send('GET request to /users');
});

// POST method route
app.post('/users', (req, res) => {
  res.send('POST request to /users');
});
\`\`\`

## Middleware

Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application's request-response cycle.

\`\`\`javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
\`\`\`

Express makes building web applications with Node.js straightforward and enjoyable!
        `,
        excerpt: "Learn the basics of Express.js, a flexible Node.js web application framework for building web and mobile applications.",
        coverImage: "https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "Michael Brown",
        categoryId: 2,
        published: true
      },
      {
        title: "Understanding Docker for Development",
        slug: "understanding-docker-for-development",
        content: `
# Understanding Docker for Development

Docker is a platform for developing, shipping, and running applications in containers.

## What are Containers?

Containers are lightweight, standalone, executable packages that include everything needed to run an application.

## Basic Docker Commands

Here are some essential Docker commands to get you started:

\`\`\`bash
# Pull an image from Docker Hub
docker pull node:14

# Run a container
docker run -d -p 3000:3000 --name my-node-app node:14

# List running containers
docker ps

# Stop a container
docker stop my-node-app

# Remove a container
docker rm my-node-app
\`\`\`

## Creating a Dockerfile

A Dockerfile is a text file that contains instructions for building a Docker image:

\`\`\`dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
\`\`\`

## Docker Compose

Docker Compose is a tool for defining and running multi-container Docker applications:

\`\`\`yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  database:
    image: mongo
    ports:
      - "27017:27017"
\`\`\`

Docker can significantly improve your development workflow!
        `,
        excerpt: "Learn how Docker can improve your development workflow. Understand containers, basic Docker commands, Dockerfiles, and Docker Compose.",
        coverImage: "https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        author: "David Wilson",
        categoryId: 4,
        published: true
      }
    ];
    
    samplePosts.forEach(async (post) => {
          const createdPost = await this.createPost(post);
      
      // Add tags to posts
      if (createdPost.id === 1) {
        this.addTagToPost({ postId: createdPost.id, tagId: 2 });
        this.addTagToPost({ postId: createdPost.id, tagId: 6 });
      } else if (createdPost.id === 2) {
        this.addTagToPost({ postId: createdPost.id, tagId: 3 });
        this.addTagToPost({ postId: createdPost.id, tagId: 7 });
      } else if (createdPost.id === 3) {
        this.addTagToPost({ postId: createdPost.id, tagId: 4 });
        this.addTagToPost({ postId: createdPost.id, tagId: 5 });
      }
      
      // Add comments to posts
      if (createdPost.id === 1) {
        this.createComment({
          content: ["Great introduction to React! Looking forward to more tutorials."],
          authorName: ["Jane Doe"],
          authorEmail: ["jane@example.com"],
          postId: [createdPost.id], // Wrap the number in an array to match the expected type
          parentId: null
        });
        
        this.createComment({
          content: ["I'm having trouble with hooks. Could you explain them more?"],
          authorName: ["John Smith"],
          authorEmail: ["john@example.com"],
          postId: [createdPost.id],
          parentId: null
        });
      }
    });
  }
  
  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(post => post.slug === slug);
  }
  
  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.categoryId === categoryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getPostsByTag(tagId: number): Promise<Post[]> {
    const postIds = Array.from(this.postTags.values())
      .filter(postTag => postTag.tagId === tagId)
      .map(postTag => postTag.postId);
    
    return Array.from(this.posts.values())
      .filter(post => postIds.includes(post.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async searchPosts(query: string): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) || 
        post.content.toLowerCase().includes(lowercaseQuery) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const now = new Date();
    const newPost: Post = {
      ...post,
      id: this.postId++,
      createdAt: now,
      updatedAt: now,
      excerpt: post.excerpt ?? null, // Ensure excerpt is either a string or null
      coverImage: post.coverImage ?? null, // Ensure coverImage is either a string or null
      published: post.published ?? false, // Ensure published has a default value
      categoryId: post.categoryId ?? null, // Ensure categoryId is either a number or null
    };
    
    this.posts.set(newPost.id, newPost);
    return newPost;
  }
  
  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    
    if (!existingPost) {
      return undefined;
    }
    
    const updatedPost: Post = {
      ...existingPost,
      ...post,
      updatedAt: new Date(),
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deletePost(id: number): Promise<boolean> {
    // First delete all related entities
    
    // Delete related comments
    Array.from(this.comments.values())
      .filter(comment => comment.postId === id)
      .forEach(comment => this.comments.delete(comment.id));
    
    // Delete related post tags
    Array.from(this.postTags.values())
      .filter(postTag => postTag.postId === id)
      .forEach(postTag => this.postTags.delete(postTag.id));
    
    return this.posts.delete(id);
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.categoryId++,
      description: category.description ?? null, // Ensure description is either a string or null
    };
    
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: Category = {
      ...existingCategory,
      ...category,
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    // Update posts in this category to have no category
    Array.from(this.posts.values())
      .filter(post => post.categoryId === id)
      .forEach(post => {
        const updatedPost = { ...post, categoryId: null };
        this.posts.set(post.id, updatedPost);
      });
    
    return this.categories.delete(id);
  }
  
  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(tag => tag.slug === slug);
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: this.tagId++,
    };
    
    this.tags.set(newTag.id, newTag);
    return newTag;
  }
  
  async updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined> {
    const existingTag = this.tags.get(id);
    
    if (!existingTag) {
      return undefined;
    }
    
    const updatedTag: Tag = {
      ...existingTag,
      ...tag,
    };
    
    this.tags.set(id, updatedTag);
    return updatedTag;
  }
  
  async deleteTag(id: number): Promise<boolean> {
    // Delete related post tags
    Array.from(this.postTags.values())
      .filter(postTag => postTag.tagId === id)
      .forEach(postTag => this.postTags.delete(postTag.id));
    
    return this.tags.delete(id);
  }
  
  // PostTag operations
  async getTagsByPostId(postId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.postTags.values())
      .filter(postTag => postTag.postId === postId)
      .map(postTag => postTag.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => tagIds.includes(tag.id));
  }
  
  async addTagToPost(postTag: InsertPostTag): Promise<PostTag> {
    // Check if the post-tag relationship already exists
    const exists = Array.from(this.postTags.values()).some(
      existingPostTag => 
        existingPostTag.postId === postTag.postId && 
        existingPostTag.tagId === postTag.tagId
    );
    
    if (exists) {
      throw new Error("Tag is already associated with this post");
    }
    
    const newPostTag: PostTag = {
      ...postTag,
      id: this.postTagId++,
    };
    
    this.postTags.set(newPostTag.id, newPostTag);
    return newPostTag;
  }
  
  async removeTagFromPost(postId: number, tagId: number): Promise<boolean> {
    const postTagToRemove = Array.from(this.postTags.values()).find(
      postTag => postTag.postId === postId && postTag.tagId === tagId
    );
    
    if (!postTagToRemove) {
      return false;
    }
    
    return this.postTags.delete(postTagToRemove.id);
  }
  
  // Comment operations
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createComment(comment: InsertComment): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.commentId++,
      createdAt: new Date(),
      content: typeof comment.content === "string" ? comment.content : "", // Ensure content is a string or default to an empty string
      postId: Array.isArray(comment.postId) ? comment.postId[0] : (comment.postId ?? 0), // Ensure postId is a number
      authorName: Array.isArray(comment.authorName) ? comment.authorName.join(", ") : (comment.authorName ?? "Anonymous"), // Ensure authorName is a string
      authorEmail: Array.isArray(comment.authorEmail) ? comment.authorEmail.join(", ") : (comment.authorEmail ?? "unknown@example.com"), // Ensure authorEmail is a string
      parentId: Array.isArray(comment.parentId) ? comment.parentId[0] : comment.parentId ?? null, // Ensure parentId is a number or null
    };
    
    this.comments.set(newComment.id, newComment);
    return newComment;
  }
  
  async updateComment(id: number, comment: Partial<InsertComment>): Promise<Comment | undefined> {
    const existingComment = this.comments.get(id);
    
    if (!existingComment) {
      return undefined;
    }
    
    const updatedComment: Comment = {
      ...existingComment,
      ...comment,
    };
    
    this.comments.set(id, updatedComment);
    return updatedComment;
  }
  
  async deleteComment(id: number): Promise<boolean> {
    // Update any child comments to have no parent
    Array.from(this.comments.values())
      .filter(comment => comment.parentId === id)
      .forEach(comment => {
        const updatedComment = { ...comment, parentId: null };
        this.comments.set(comment.id, updatedComment);
      });
    
    return this.comments.delete(id);
  }
  
  // Media operations
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.media.values())
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  
  async getMediaById(id: number): Promise<Media | undefined> {
    return this.media.get(id);
  }
  
  async createMedia(media: InsertMedia): Promise<Media> {
    const newMedia: Media = {
      ...media,
      id: this.mediaId++,
      uploadedAt: new Date(),
    };
    
    this.media.set(newMedia.id, newMedia);
    return newMedia;
  }
  
  async deleteMedia(id: number): Promise<boolean> {
    return this.media.delete(id);
  }
}

import { DatabaseStorage } from "./database-storage";

// Use DatabaseStorage for persistent storage with PostgreSQL
export const storage = new DatabaseStorage();
