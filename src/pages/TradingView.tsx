import { useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Layout";

export default function TradingView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const chartsUrl = "https://charts.deriv.com/deriv";

  useEffect(() => {
    // ✅ Load auth data saved by AuthCallback
    const derivToken = localStorage.getItem("deriv_token");
    const derivAccounts = localStorage.getItem("deriv_accounts");

    if (derivToken) setToken(derivToken);
    if (derivAccounts) {
      try {
        setAccounts(JSON.parse(derivAccounts));
      } catch (err) {
        console.error("Failed to parse deriv_accounts", err);
      }
    }

    // 👇 Dynamically resize iframe to fill viewport below navbar
    const adjustIframeHeight = () => {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
      if (iframeRef.current) {
        iframeRef.current.style.height = `${
          window.innerHeight - navbarHeight
        }px`;
      }
    };

    adjustIframeHeight();
    window.addEventListener("resize", adjustIframeHeight);
    return () => window.removeEventListener("resize", adjustIframeHeight);
  }, []);

  // 🕓 Loading state before iframe renders
  if (!token) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-gray-600">
          Authenticating your session…
        </div>
      </Layout>
    );
  }

  // You can later use `token` to call Deriv’s WebSocket API for live data
  console.log("✅ Authenticated token:", token);
  console.log("✅ Available accounts:", accounts);

  return (
    <Layout>
      {" "}
      <div className="w-full h-full bg-[#f8fafc] overflow-hidden">
        {" "}
        <iframe
          ref={iframeRef}
          title="Deriv Live Charts"
          src={chartsUrl}
          className="w-full border-none"
          allowFullScreen
          loading="eager"
        />{" "}
      </div>{" "}
    </Layout>
  );
}
