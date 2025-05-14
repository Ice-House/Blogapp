import express, { type Express, type Request, type Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPostSchema, insertCategorySchema, insertTagSchema, insertCommentSchema, insertMediaSchema } from "@shared/schema";
import { configureAuth, register, login, logout, getCurrentUser, isAuthenticated } from "./auth";
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
// ... existing multer configuration ...

export async function registerRoutes(app: Express): Promise<Server> {
  // Add request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Add health check endpoint
  app.get("/api/health", async (req: Request, res: Response) => {
    try {
      console.log('🔍 Running health check...');
      const dbResult = await storage.getAllPosts();
      console.log('✅ Database connection successful');
      res.json({ 
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Health check failed:', error);
      res.status(500).json({ 
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Configure authentication middleware
  configureAuth(app);

  // Posts routes with enhanced logging
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      console.log('🔍 Fetching all posts...');
      const posts = await storage.getAllPosts();
      console.log(`✅ Successfully fetched ${posts.length} posts`);
      res.json(posts);
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      res.status(500).json({ 
        message: "Error fetching posts", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Categories routes with enhanced logging
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      console.log('🔍 Fetching all categories...');
      const categories = await storage.getAllCategories();
      console.log(`✅ Successfully fetched ${categories.length} categories`);
      res.json(categories);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      res.status(500).json({ 
        message: "Error fetching categories", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Tags routes with enhanced logging
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      console.log('🔍 Fetching all tags...');
      const tags = await storage.getAllTags();
      console.log(`✅ Successfully fetched ${tags.length} tags`);
      res.json(tags);
    } catch (error) {
      console.error('❌ Error fetching tags:', error);
      res.status(500).json({ 
        message: "Error fetching tags", 
        error: error instanceof Error ? error.message : String(error)
      });
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
  app.post("/api/upload", isAuthenticated, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const user = req.user as any;
      
      const mediaData = {
        filename: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        // Store user ID with the media if needed for future features
        // userId: user.id
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

  // ... rest of your existing routes ...

  // Add global error handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Global error:', error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
    });
  });


    // File upload route
    app.post("/api/upload", isAuthenticated, upload.single("file"), async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        const user = req.user as any;
        
        const mediaData = {
          filename: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          // Store user ID with the media if needed for future features
          // userId: user.id
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

  // ... your existing file upload and static file serving code ...

  const httpServer = createServer(app);
  return httpServer;
}




































































