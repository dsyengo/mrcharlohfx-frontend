import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Processing authorization…");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Deriv returns multiple tokens in query params: token1, token2, ...
    const tokenKeys = Array.from(searchParams.keys()).filter((key) => key.startsWith("token"));

    if (tokenKeys.length === 0) {
      console.error("No tokens found in URL");
      navigate("/login", { replace: true });
      return;
    }

    // Pick the first token (or apply logic to select the desired account)
    const firstTokenKey = tokenKeys[0];
    const derivToken = searchParams.get(firstTokenKey);

    if (!derivToken) {
      console.error("Failed to extract Deriv token");
      navigate("/login", { replace: true });
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
        if (!token) return null;
        return { accountId: acct ?? undefined, currency: cur ?? undefined, token };
      })
      .filter(Boolean);
    localStorage.setItem("deriv_accounts", JSON.stringify(accounts));

    setMessage("Success! Redirecting to your dashboard…");
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  // Loading UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-blue-800">
        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
