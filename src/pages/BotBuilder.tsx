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

    const directUrl = `https://dbot.deriv.com/#bot_builder?token=${token}`;
    setIframeUrl(directUrl);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full bg-gray-50">
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
      <div className="w-full h-[calc(100vh-4rem)] overflow-hidden bg-white">
        <iframe
          src={iframeUrl ?? ""}
          title="Deriv Bot Builder"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write; fullscreen; autoplay"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </Layout>
  );
}
