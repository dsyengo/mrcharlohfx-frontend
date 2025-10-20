// pages/AuthCallback.tsx
import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const { refreshAccounts } = useAuth();
  const [message, setMessage] = useState<string>("Processing authorization…");

  useEffect(() => {
    const processAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);

        // Debug: Log all URL parameters
        console.log(
          "URL Parameters:",
          Object.fromEntries(searchParams.entries())
        );

        // Deriv returns multiple tokens in query params: token1, token2, ...
        const tokenKeys = Array.from(searchParams.keys()).filter((key) =>
          key.startsWith("token")
        );

        if (tokenKeys.length === 0) {
          console.error("No tokens found in URL");
          setMessage("No authentication tokens found. Redirecting to login...");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        // Pick the first token (or apply logic to select the desired account)
        const firstTokenKey = tokenKeys[0];
        const derivToken = searchParams.get(firstTokenKey);

        if (!derivToken) {
          console.error("Failed to extract Deriv token");
          setMessage("Invalid authentication token. Redirecting to login...");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        // ✅ Save tokens for protected routes and API use
        // Store primary token for guards
        localStorage.setItem("deriv_token", derivToken);

        // Store ALL returned accounts/tokens/currencies for later selection
        const accounts = tokenKeys
          .map((tKey) => {
            const token = searchParams.get(tKey);
            const idx = tKey.replace("token", "");
            const acct = searchParams.get(`acct${idx}`);
            const cur = searchParams.get(`cur${idx}`);
            const loginid = searchParams.get(`loginid${idx}`);
            if (!token) return null;
            return {
              accountId: acct ?? undefined,
              currency: cur ?? undefined,
              loginid: loginid ?? undefined,
              token,
            };
          })
          .filter(Boolean);

        localStorage.setItem("deriv_accounts", JSON.stringify(accounts));

        // Verify storage
        console.log(
          "Stored token:",
          localStorage.getItem("deriv_token") ? "YES" : "NO"
        );
        console.log(
          "Stored accounts:",
          localStorage.getItem("deriv_accounts") ? "YES" : "NO"
        );

        // Refresh the auth context
        refreshAccounts();

        setMessage("Success! Redirecting to your dashboard…");

        // Wait a bit to ensure everything is processed
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } catch (error) {
        console.error("Auth processing error:", error);
        setMessage("Authentication failed. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    processAuth();
  }, [navigate, refreshAccounts]);

  // Loading UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900 block">
            {message}
          </span>
          <span className="text-xs text-gray-500 mt-1 block">
            Please wait while we set up your account...
          </span>
        </div>
      </div>
    </div>
  );
}
