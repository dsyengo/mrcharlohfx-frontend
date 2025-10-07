import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Redirecting…");

  useEffect(() => {
    // Parse ?code=...&state=... from the current URL
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // If no code exists, go back to /login
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    // Exchange the authorization code with our backend
    (async () => {
      try {
        setMessage("Authorizing…");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          // Failed exchange → go back to login
          console.error("Auth callback failed:", response.status, await response.text());
          navigate("/login", { replace: true });
          return;
        }

        // Successful exchange → backend likely set a session or returned data
        setMessage("Success. Redirecting to dashboard…");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  // Minimal loading UI while the above runs
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-blue-800">
        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}


