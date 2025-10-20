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
    const checkAuth = () => {
      // Check multiple possible auth indicators
      const derivToken = localStorage.getItem("deriv_token");
      const derivAccounts = localStorage.getItem("deriv_accounts");

      // Consider authenticated if either token exists or accounts exist
      const authenticated = Boolean(derivToken) || Boolean(derivAccounts);
      setIsAuthenticated(authenticated);
      setIsChecking(false);
    };

    checkAuth();

    // Optional: Listen for storage changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
