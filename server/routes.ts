import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPostSchema, insertCategorySchema, insertTagSchema, insertCommentSchema, insertMediaSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  const apiRouter = app.route("/api");
  
  // Posts routes
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts", error });
    }
  });
  
  app.get("/api/posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const tags = await storage.getTagsByPostId(post.id);
      const comments = await storage.getCommentsByPostId(post.id);
      
      res.json({ post, tags, comments });
    } catch (error) {
      res.status(500).json({ message: "Error fetching post", error });
    }
  });
  
  app.post("/api/posts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(validatedData);
      
      // Handle tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagId of req.body.tags) {
          try {
            await storage.addTagToPost({ postId: post.id, tagId });
          } catch (error) {
            console.error("Error adding tag to post:", error);
          }
        }
      }
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating post", error });
    }
  });
  
  app.put("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const existingPost = await storage.getPostById(id);
      
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Validate partial update data
      const validatedData = insertPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updatePost(id, validatedData);
      
      // Update tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        // Get current tags
        const currentTags = await storage.getTagsByPostId(id);
        const currentTagIds = currentTags.map(tag => tag.id);
        const newTagIds = req.body.tags;
        
        // Remove tags that are no longer associated
        for (const tagId of currentTagIds) {
          if (!newTagIds.includes(tagId)) {
            await storage.removeTagFromPost(id, tagId);
          }
        }
        
        // Add new tags
        for (const tagId of newTagIds) {
          if (!currentTagIds.includes(tagId)) {
            try {
              await storage.addTagToPost({ postId: id, tagId });
            } catch (error) {
              console.error("Error adding tag to post:", error);
            }
          }
        }
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating post", error });
    }
  });
  
  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const existingPost = await storage.getPostById(id);
      
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const deleted = await storage.deletePost(id);
      
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete post" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting post", error });
    }
  });
  
  // Search posts
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchPosts(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Error searching posts", error });
    }
  });
  
  // Categories routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error });
    }
  });
  
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const posts = await storage.getPostsByCategory(category.id);
      res.json({ category, posts });
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error });
    }
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category", error });
    }
  });
  
  // Tags routes
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tags", error });
    }
  });
  
  app.get("/api/tags/:slug", async (req: Request, res: Response) => {
    try {
      const tag = await storage.getTagBySlug(req.params.slug);
      
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      const posts = await storage.getPostsByTag(tag.id);
      res.json({ tag, posts });
    } catch (error) {
      res.status(500).json({ message: "Error fetching tag", error });
    }
  });
  
  app.post("/api/tags", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tag data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating tag", error });
    }
  });
  
  // Comments routes
  app.get("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments", error });
    }
  });
  
  app.post("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        postId
      });
      
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating comment", error });
    }
  });
  
  // File upload route
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const mediaData = {
        filename: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
      
      const media = await storage.createMedia(mediaData);
      
      res.status(201).json({
        ...media,
        url: `/uploads/${path.basename(req.file.path)}`
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading file", error });
    }
  });
  
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    // Implement basic security checks if needed
    next();
  }, express.static(uploadDir));
  
  const httpServer = createServer(app);
  
  return httpServer;
}
