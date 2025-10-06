import { useEffect, useState } from "react";
import Layout from "@/layouts/Layout";
import Card from "@/components/Card";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [transactions, setTransactions] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setCurrency(data.currency);
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/transactions", { credentials: "include" })
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);

    fetch("http://localhost:5000/api/open-trades", { credentials: "include" })
      .then((res) => res.json())
      .then(setOpenTrades)
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <main className="grid gap-6 md:grid-cols-3 mt-6">
        {/* Account Balance */}
        <Card className="bg-[#0a0f1f]/80 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-md hover:shadow-cyan-400/20 transition-all duration-300">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">
            Account Balance
          </h2>
          <p className="text-3xl font-bold text-white">
            {balance !== null ? `${balance} ${currency}` : "Loading..."}
          </p>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-[#0a0f1f]/80 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-md hover:shadow-cyan-400/20 transition-all duration-300">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">
            Recent Transactions
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600/40">
            {transactions.length ? (
              transactions.map((t, i) => (
                <li key={i} className="hover:text-cyan-400 transition-colors">
                  {t.action_type} — {t.amount} {t.currency}
                </li>
              ))
            ) : (
              <li>No recent transactions</li>
            )}
          </ul>
        </Card>

        {/* Open Trades */}
        <Card className="bg-[#0a0f1f]/80 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-md hover:shadow-cyan-400/20 transition-all duration-300">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">
            Open Trades
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600/40">
            {openTrades.length ? (
              openTrades.map((trade, i) => (
                <li key={i} className="hover:text-cyan-400 transition-colors">
                  {trade.contract_id} — {trade.contract_type}
                </li>
              ))
            ) : (
              <li>No open trades</li>
            )}
          </ul>
        </Card>
      </main>
    </Layout>
  );
}
