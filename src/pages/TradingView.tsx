import { useEffect, useRef } from "react";
import Layout from "@/layouts/Layout";

export default function TradingView() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chartsUrl = "https://charts.deriv.com/deriv";

  useEffect(() => {
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

  return (
    <Layout>
      <div className="w-full h-full bg-[#f8fafc] overflow-hidden">
        <iframe
          ref={iframeRef}
          title="Deriv Live Charts"
          src={chartsUrl}
          className="w-full border-none"
          allowFullScreen
          loading="eager"
        />
      </div>
    </Layout>
  );
}
