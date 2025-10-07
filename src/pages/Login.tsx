import { Button } from "@/components/ui/button";

const APP_ID = import.meta.env.VITE_APP_ID as string;
const REDIRECT_URI = import.meta.env.VITE_DERIV_REDIRECT_URI as string | undefined;

export default function Login() {
  const isValidAppId = typeof APP_ID === "string" && /^\d+$/.test(APP_ID);

  const loginWithDeriv = () => {
    if (!isValidAppId) {
      console.error("Missing or invalid VITE_DERIV_APP_ID. Set a numeric app id in .env");
      alert("Login not configured: missing app_id. Please set VITE_DERIV_APP_ID.");
      return;
    }
    const base = `https://oauth.deriv.com/oauth2/authorize?app_id=${encodeURIComponent(APP_ID)}`;
    const authUrl = REDIRECT_URI ? `${base}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` : base;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-600">Login</h1>
        <p className="text-sm text-blue-800/80 mt-1">Continue with Deriv OAuth</p>
        <div className="mt-6 space-y-3">
          <Button
            variant="default"
            className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            onClick={loginWithDeriv}
            disabled={!isValidAppId}
          >
            Login with Deriv
          </Button>
          {!isValidAppId && (
            <p className="text-xs text-red-600">Missing VITE_APP_ID in .env</p>
          )}
          <p className="text-xs text-blue-800/70">You'll be redirected to Deriv to sign in securely.</p>
        </div>
      </div>
    </div>
  );
}


