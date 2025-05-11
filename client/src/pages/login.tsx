import { Helmet } from "react-helmet";
import LoginForm from "../components/auth/login-form";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Login | Blog Platform</title>
        <meta
          name="description"
          content="Login to access your account and manage your blog posts"
        />
      </Helmet>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
