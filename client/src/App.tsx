import { Switch, Route } from "wouter";
// ...existing imports...
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Post from "@/pages/post";
import CreatePost from "@/pages/create-post";
import Category from "@/pages/category";
import Search from "@/pages/search";
import Login from "@/pages/login"; // Add these imports
import Register from "@/pages/register"; // for your auth pages

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} /> {/* Add login route */}
          <Route path="/register" component={Register} />{" "}
          {/* Add register route */}
          <Route path="/post/:slug" component={Post} />
          <Route path="/write" component={CreatePost} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
// ...existing code...
