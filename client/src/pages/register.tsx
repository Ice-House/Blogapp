import { Helmet } from "react-helmet";
import RegisterForm from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Register | Blog Platform</title>
        <meta
          name="description"
          content="Create a new account to start blogging and sharing your content"
        />
      </Helmet>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
