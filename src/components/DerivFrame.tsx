import React, { useEffect, useRef } from "react";

interface DerivFrameProps {
  page: string; // e.g. "#/bot_builder", "#/chart", "#/dashboard"
  title: string;
}

const DerivFrame: React.FC<DerivFrameProps> = ({ page, title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    <iframe
      ref={iframeRef}
      title={title}
      src={`${
        import.meta.env.VITE_PROXY_URL ||
        "https://mrcharlohfx-backend.onrender.com"
      }/deriv/${page}`}
      className="w-full border-none"
      allowFullScreen
      loading="eager"
    />
  );
};

export default DerivFrame;
