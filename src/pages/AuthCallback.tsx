import { useEffect, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback(): ReactElement {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Processing authorization…");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Deriv returns multiple tokens: token1, token2, token3, etc.
    const tokenKeys = Array.from(searchParams.keys()).filter((key) =>
      key.startsWith("token")
    );

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

    // ✅ Save the token locally for protected routes
    localStorage.setItem("deriv_token", derivToken);

    // (Optional) You could also store selected account, currency, etc.
    const account = searchParams.get(firstTokenKey.replace("token", "acct"));
    const currency = searchParams.get(firstTokenKey.replace("token", "cur"));
    if (account) localStorage.setItem("deriv_account", account);
    if (currency) localStorage.setItem("deriv_currency", currency);

    setMessage("Success! Redirecting to your dashboard…");

    // Redirect to dashboard after short delay
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 600);
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
