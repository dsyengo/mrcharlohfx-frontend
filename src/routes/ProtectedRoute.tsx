// routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("🛡️ ProtectedRoute: Checking authentication...");

    const checkAuth = () => {
      // Check multiple auth indicators with a small delay
      setTimeout(() => {
        const derivToken = localStorage.getItem("deriv_token");
        const derivAccounts = localStorage.getItem("deriv_accounts");

        const hasToken = Boolean(derivToken);
        const hasAccounts = Boolean(derivAccounts);
        const authenticated = hasToken || hasAccounts;

        console.log("🛡️ ProtectedRoute check result:", {
          hasToken,
          hasAccounts,
          authenticated,
          path: location.pathname,
        });

        setIsAuthenticated(authenticated);
        setIsChecking(false);
      }, 50); // Small delay to ensure localStorage is updated
    };

    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Checking access...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🛡️ ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log("🛡️ ProtectedRoute: User authenticated, rendering content");
  return <>{children}</>;
}
