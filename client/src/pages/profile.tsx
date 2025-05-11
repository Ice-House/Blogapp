import { Helmet } from "react-helmet";
import UserProfile from "../components/auth/user-profile";
import { useAuth } from "../hooks/use-auth";
import { Redirect } from "wouter";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Blog Platform</title>
        <meta
          name="description"
          content="View and manage your user profile settings"
        />
      </Helmet>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <UserProfile />
        </div>
      </div>
    </>
  );
}
