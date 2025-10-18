import { useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Layout";

export default function ChartsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [derivAccount, setDerivAccount] = useState<string | null>(null);

  useEffect(() => {
    // 👇 Retrieve user’s Deriv account (set during your OAuth login flow)
    const storedAccount = localStorage.getItem("deriv_account");
    setDerivAccount(storedAccount || "BTC"); // fallback for demo

    // 👇 Dynamically adjust iframe height to fit viewport (minus navbar)
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

  if (!derivAccount) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-gray-600">
          Loading your trading account...
        </div>
      </Layout>
    );
  }

  // 👇 Build DTrader URL dynamically based on user account
  const traderUrl = `https://app.deriv.com/dtrader?account=${derivAccount}&chart_type=area&interval=1t&symbol=1HZ100V&trade_type=vanillalongcall`;

  return (
    <Layout>
      <div className="w-full h-full bg-[#f8fafc] overflow-hidden">
        <iframe
          ref={iframeRef}
          title="Deriv DTrader Charts"
          src={traderUrl}
          className="w-full border-none"
          allowFullScreen
          loading="eager"
        />
      </div>
    </Layout>
  );
}
