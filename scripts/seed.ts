import { db } from "../server/db";
import { posts, categories, tags, postTags, comments, users } from "../shared/schema";
import { desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Check if database already has content
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length > 0) {
    console.log("Database already has content, skipping seed");
    return;
  }

  // Seed users first
  console.log("Adding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const [adminUser, authorUser] = await db.insert(users).values([
    {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      displayName: "Admin User",
      role: "admin"
    },
    {
      username: "author",
      email: "author@example.com",
      password: hashedPassword,
      displayName: "Author User",
      role: "author"
    }
  ]).returning();

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
      content: `# Getting Started with React...`, // Your existing content
      excerpt: "Learn the basics of React and how to set up your first React application",
      author: authorUser.displayName || authorUser.username,
      userId: authorUser.id,
      categoryId: programming.id,
      published: true,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15")
    },
    {
      title: "Introduction to Express.js",
      slug: "introduction-to-expressjs",
      content: `# Introduction to Express.js...`, // Your existing content
      excerpt: "Learn the basics of Express.js and how to build a simple web server",
      author: authorUser.displayName || authorUser.username,
      userId: authorUser.id,
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









































