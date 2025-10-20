// pages/AuthCallback.tsx
import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Processing authorization…");

  useEffect(() => {
    const processAuth = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);

        console.log(
          "🔍 Checking URL parameters:",
          Object.fromEntries(searchParams.entries())
        );

        const tokenKeys = Array.from(searchParams.keys()).filter((key) =>
          key.startsWith("token")
        );

        if (tokenKeys.length === 0) {
          console.error("❌ No tokens found in URL");
          setMessage("No authentication tokens found");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        const firstTokenKey = tokenKeys[0];
        const derivToken = searchParams.get(firstTokenKey);

        if (!derivToken) {
          console.error("❌ Failed to extract Deriv token");
          setMessage("Invalid authentication token");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        // ✅ Save tokens to localStorage
        localStorage.setItem("deriv_token", derivToken);
        console.log("✅ Token stored in localStorage");

        // Store accounts
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
        console.log("✅ Accounts stored:", accounts);

        setMessage("✅ Success! Redirecting to dashboard...");

        // CRITICAL FIX: Use direct navigation with delay to ensure localStorage is set
        setTimeout(() => {
          console.log("🚀 Navigating to dashboard...");
          navigate("/dashboard", { replace: true });
        }, 100);
      } catch (error) {
        console.error("❌ Auth processing error:", error);
        setMessage("Authentication failed");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900 block">
            {message}
          </span>
          <span className="text-xs text-gray-500 mt-1 block">
            {message.includes("Success")
              ? "Setting up your account..."
              : "Please wait..."}
          </span>
        </div>
      </div>
    </div>
  );
}
