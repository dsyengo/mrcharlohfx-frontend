import Layout from "@/layouts/Layout";
import React from "react";

const DerivBotEmbed: React.FC = () => {
  const derivBotUrl = "https://dbot.deriv.com/#dashboard";

  return (
    <Layout>
      <div style={{ width: "100%", height: "90vh" }}>
        <iframe
          src={derivBotUrl}
          title="Deriv Bot Dashboard"
          width="100%"
          height="100%"
          frameBorder="0" // Optional: removes the border
          allowFullScreen // Optional: allows full screen on some devices
          // Tailwind utility classes can still wrap the div container:
          className="rounded-lg shadow-xl"
        />
      </div>
    </Layout>
  );
};

export default DerivBotEmbed;
