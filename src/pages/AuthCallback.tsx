import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Redirecting…");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // If no authorization code → redirect back to login
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    // Perform token exchange with backend
    (async () => {
      try {
        setMessage("Authorizing…");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // include cookies if backend sets them
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          console.error("Auth callback failed:", response.status, await response.text());
          navigate("/login", { replace: true });
          return;
        }

        // ✅ Try to parse the backend response
        const data = await response.json().catch(() => ({}));

        // ✅ Check for token or session indication
        if (data?.token) {
          // Save token for client-side route protection
          localStorage.setItem("deriv_token", data.token);
        } else if (!document.cookie.includes("session")) {
          // If neither a token nor a cookie session exists, treat it as failed
          console.warn("No token or session cookie found after callback");
          navigate("/login", { replace: true });
          return;
        }

        // ✅ Redirect to dashboard on success
        setMessage("Success. Redirecting to dashboard…");
        setTimeout(() => navigate("/dashboard", { replace: true }), 500);

      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  // Simple loading UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-blue-800">
        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
