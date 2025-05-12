import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";

export default function LogoutButton() {
  const { logout, logoutStatus } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      setLocation("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={logoutStatus.isLoading}
      className="text-neutral-700 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
    >
      <LogOut className="w-5 h-5 mr-2" />
      <span>{logoutStatus.isLoading ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}
