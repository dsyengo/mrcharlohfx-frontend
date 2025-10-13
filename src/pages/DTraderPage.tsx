import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Layout";

/**
 * Types
 */
interface ActiveSymbol {
  display_name: string;
  symbol: string;
  market: string;
}

interface DerivActiveSymbolsResponse {
  active_symbols?: ActiveSymbol[];
  error?: { code: string; message: string };
}

/**
 * Utility function to fetch Deriv data through your proxy
 */
async function fetchDerivAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`/deriv/${endpoint}`);

    // Defensive check
    const text = await response.text();
    if (text.startsWith("<")) {
      throw new Error(
        "Received HTML instead of JSON. Check your proxy configuration or endpoint path."
      );
    }

    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(data?.error?.message || "Deriv API request failed");
    }

    return data as T;
  } catch (err: any) {
    console.error("❌ Deriv API error:", err);
    throw err;
  }
}

/**
 * DTraderPage component
 * - Fetches data from Deriv API through your reverse proxy (/deriv)
 * - Optionally displays the full DTrader interface through /dtrader proxy
 */
const DTraderPage: React.FC = () => {
  const [symbols, setSymbols] = useState<ActiveSymbol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeBlocked, setIframeBlocked] = useState<boolean>(false);

  /**
   * Fetch active symbols via the Deriv proxy
   */
  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const data = await fetchDerivAPI<DerivActiveSymbolsResponse>(
          "active_symbols?product_type=basic"
        );

        if (data?.active_symbols) {
          setSymbols(data.active_symbols);
        } else {
          throw new Error("No active symbols found.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSymbols();
  }, []);

  /**
   * OPTION C — Embed the DTrader/DBot interface
   */
  const renderDTraderEmbed = () => {
    const iframeSrc = "/dtrader/#chart";

    return (
      <iframe
        src={iframeSrc}
        title="DTrader via Proxy"
        onError={() => setIframeBlocked(true)}
        style={{
          width: "100%",
          height: "80vh",
          border: "none",
          marginTop: "2rem",
          borderRadius: "8px",
        }}
      />
    );
  };

  /**
   * Render UI
   */
  return (
    <Layout>
      <div style={{ padding: "1rem" }}>
        <h1>🧠 Deriv DTrader Integration Example</h1>

        <section style={{ marginBottom: "2rem" }}>
          <h2>Option B — Fetch DTrader API Data (via Proxy)</h2>

          {loading && <p>Loading symbols…</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading && !error && (
            <ul>
              {symbols.slice(0, 10).map((s) => (
                <li key={s.symbol}>
                  <strong>{s.display_name}</strong> ({s.symbol}) — {s.market}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Option C — Embed DTrader via Proxy</h2>
          {iframeBlocked ? (
            <div style={{ marginTop: "2rem" }}>
              <p>
                ⚠️ DTrader refused to load inside the iframe (CSP blocked).
                <br />
                You can open it directly instead:
              </p>
              <a
                href="https://dbot.deriv.com/#chart"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0b74de",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                Open DTrader in a new tab →
              </a>
            </div>
          ) : (
            renderDTraderEmbed()
          )}
        </section>
      </div>
    </Layout>
  );
};

export default DTraderPage;
