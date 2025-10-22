// pages/BotBuilderEmbed.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Layout";
import { Loader2 } from "lucide-react";

export default function BotBuilder() {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("deriv_token");

    if (!token) {
      console.error("❌ No Deriv token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    // ✅ Option 1: Direct Deriv page (if allowed by headers)
    const directUrl = `https://dbot.deriv.com/?token=${token}`;

    // ✅ Option 2 (recommended): Through your reverse proxy
    // const directUrl = `${import.meta.env.VITE_API_URL}/proxy/dbot?token=${token}`;

    setIframeUrl(directUrl);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600 text-sm">
            Loading Deriv Bot Builder...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Deriv Bot Builder
            </h1>
          </div>

          {/* ✅ Bot Builder Embed */}
          <div className="relative w-full h-[85vh] rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
            <iframe
              src={iframeUrl ?? ""}
              title="Deriv Bot Builder"
              className="w-full h-full border-0"
              allow="clipboard-read; clipboard-write; fullscreen; autoplay"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
