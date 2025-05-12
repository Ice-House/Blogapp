import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { User, InsertUser, UserRegistration } from '@shared/schema';

// Configure passport to use a local strategy for authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      // If user not found or password doesn't match
      if (!user || !await bcrypt.compare(password, user.password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      
      // User authenticated successfully
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to store in session
passport.serializeUser((user: any, done) => {
  done(null, (user as { id: number }).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Configure session middleware
export const configureAuth = (app: any) => {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key', // Replace with actual secret in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );

  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body as UserRegistration;
    
    // Check if username already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create the user
    const newUser = await storage.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      displayName: userData.displayName,
      profileImage: userData.profileImage,
      bio: userData.bio
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    
    // Return the created user
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user', error });
  }
};

// Login a user
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: User, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ message: info.message || 'Authentication failed' });
    }
    
    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Return the authenticated user
      return res.json({ user: userWithoutPassword });
    });
  })(req, res, next);
};

// Logout a user
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout', error: err });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

// Get the current authenticated user
export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const user = req.user as User;
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
};

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};