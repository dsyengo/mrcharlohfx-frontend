import { Button } from "@/components/ui/button";

const APP_ID = import.meta.env.VITE_DERIV_APP_ID as string;
const REDIRECT_URI = (import.meta.env.VITE_DERIV_REDIRECT_URI as string) || `${window.location.origin}/auth/callback`;

export default function Login() {
  const loginWithDeriv = () => {
    const authUrl = `https://oauth.deriv.com/oauth2/authorize?app_id=${encodeURIComponent(APP_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-600">Login</h1>
        <p className="text-sm text-blue-800/80 mt-1">Continue with Deriv OAuth</p>
        <div className="mt-6 space-y-3">
          <Button variant="default" className="w-full bg-green-600 text-white hover:bg-green-700" onClick={loginWithDeriv}>Login with Deriv</Button>
          <p className="text-xs text-blue-800/70">You'll be redirected to Deriv to sign in securely.</p>
        </div>
      </div>
    </div>
  );
}


