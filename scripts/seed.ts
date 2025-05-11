import { db } from "../server/db";
import { posts, categories, tags, postTags, comments } from "../shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Check if database already has content
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length > 0) {
    console.log("Database already has content, skipping seed");
    return;
  }

  // Seed categories
  console.log("Adding categories...");
  const [programming] = await db.insert(categories).values([
    { name: "Programming", slug: "programming", description: "Articles about programming and software development" },
    { name: "Web Development", slug: "web-development", description: "Topics related to web development" },
    { name: "Design", slug: "design", description: "UI/UX and design principles" }
  ]).returning();

  // Seed tags
  console.log("Adding tags...");
  const [javascript, react, typescript] = await db.insert(tags).values([
    { name: "JavaScript", slug: "javascript" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Node.js", slug: "nodejs" },
    { name: "CSS", slug: "css" }
  ]).returning();

  // Seed posts
  console.log("Adding posts...");
  const [post1, post2] = await db.insert(posts).values([
    {
      title: "Getting Started with React",
      slug: "getting-started-with-react",
      content: `# Getting Started with React

React is a JavaScript library for building user interfaces. It's maintained by Facebook and a community of individual developers and companies.

## Why React?

React allows developers to create large web applications that can change data, without reloading the page. Its main purpose is to be fast, scalable, and simple.

## Setting up a React project

The easiest way to start with React is to use Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will create a new React application and start a development server.

## React Components

Components are the building blocks of a React application. A component is a JavaScript function or class that optionally accepts inputs (props) and returns a React element that describes how a section of the UI should appear.

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

## JSX

React uses JSX, a syntax extension to JavaScript. JSX looks like HTML but has the full power of JavaScript. It compiles to regular JavaScript function calls.

\`\`\`jsx
const element = <h1>Hello, world!</h1>;
\`\`\`

## Conclusion

React is a powerful library for building user interfaces. With its component-based architecture and virtual DOM, it provides a great developer experience and excellent performance for your applications.
`,
      excerpt: "Learn the basics of React and how to set up your first React application",
      author: "Jane Developer",
      categoryId: programming.id,
      published: true,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15")
    },
    {
      title: "Introduction to Express.js",
      slug: "introduction-to-expressjs",
      content: `# Introduction to Express.js

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Why Express?

Express provides a thin layer of fundamental web application features, without obscuring Node.js features. It's a minimal and flexible framework that provides a robust set of features for web and mobile applications.

## Setting up an Express application

Let's create a simple Express application:

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

Express provides a simple way to define routes:

\`\`\`javascript
app.get('/users', (req, res) => {
  // Get all users
});

app.post('/users', (req, res) => {
  // Create a new user
});

app.get('/users/:id', (req, res) => {
  // Get user with ID
  const userId = req.params.id;
});
\`\`\`

## Middleware

Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application's request-response cycle.

\`\`\`javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
\`\`\`

## Conclusion

Express.js is a great framework for building web applications with Node.js. It's minimal, flexible, and has a large ecosystem of middleware and extensions.
`,
      excerpt: "Learn the basics of Express.js and how to build a simple web server",
      author: "John Backend",
      categoryId: programming.id,
      published: true,
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-02-12")
    }
  ]).returning();

  // Add tags to posts
  console.log("Linking posts and tags...");
  await db.insert(postTags).values([
    { postId: post1.id, tagId: javascript.id },
    { postId: post1.id, tagId: react.id },
    { postId: post2.id, tagId: javascript.id },
    { postId: post2.id, tagId: typescript.id }
  ]);

  // Add comments
  console.log("Adding comments...");
  await db.insert(comments).values([
    {
      content: "Great article! This helped me understand React better.",
      authorName: "User123",
      authorEmail: "user123@example.com",
      postId: post1.id,
      createdAt: new Date("2023-01-16")
    },
    {
      content: "I've been using Express for years and still learned something new!",
      authorName: "DevPro",
      authorEmail: "devpro@example.com",
      postId: post2.id,
      createdAt: new Date("2023-02-15")
    }
  ]);

  console.log("✅ Database seeded successfully!");
}

// Run the seed function
seed()
  .catch(e => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection
    await db.$client.end();
    process.exit(0);
  });