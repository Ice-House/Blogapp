# 📝 BlogPlatform

A modern full-stack blogging platform built with React, Vite, Node.js, Express, PostgreSQL, Drizzle ORM, and styled with Tailwind CSS and shadcn/ui. Designed for simplicity, performance, and scalability.

## 🚀 Features

- 🖊️ Create, edit, and delete blog posts
- 🔍 Search functionality (in progress)
- 🧾 Markdown content support
- 🧑‍💻 Author and category management
- 🌐 REST API powered by Express.js
- 📦 Drizzle ORM migrations & schema syncing
- 💅 Styled with Tailwind CSS and [shadcn/ui](https://ui.shadcn.com)
- 🧪 Easy-to-extend structure for future enhancements

## 📦 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- **Tooling**: Drizzle Kit, dotenv, tsx

## 🛠️ Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/blogplatform.git
   cd blogplatform
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file:

   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/blogplatform
   ```

4. **Run migrations**:

   ```bash
   npx drizzle-kit push
   ```

5. **(Optional) Seed the database**:

   ```bash
   npx tsx scripts/seed.ts
   ```

6. **Start the app**:

   ```bash
   npm run dev
   ```

## ⚠️ Troubleshooting

- **ENOTSUP / socket errors (Windows)**: Use `'localhost'` instead of `'0.0.0.0'` in `server/index.ts`:

  ```ts
  app.listen(port, "localhost", () => {
    console.log(`Server running on port ${port}`);
  });
  ```

- **WebSocket errors with Neon**: Remove the WebSocket override in `server/db.ts` for local setups.

## ✅ To Do

- [ ] Complete search functionality
- [ ] Add user authentication
- [ ] Enable rich text editing
- [ ] Deploy to production

## 🤝 Contributions

Pull requests are welcome! Please fork the repository and open a PR.

## 📄 License

MIT © 2025 YongCarter
