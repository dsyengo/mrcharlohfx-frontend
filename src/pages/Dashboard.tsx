import { useEffect, useState } from "react";
import Layout from "@/layouts/Layout";
import { Link } from "react-router-dom";
import {
  Home,
  Bot,
  LineChart,
  BarChart2,
  Zap,
  Rocket,
  DollarSign,
  Users,
  RefreshCw,
  LogIn,
  Shield,
  TrendingUp,
} from "lucide-react";

type Account = {
  accountId?: string;
  currency?: string;
  token: string;
  loginid?: string;
  balance?: number;
};

type TradingAccount = Account & {
  loginid: string;
  balance: number;
  isActive: boolean;
  accountType: "real" | "demo";
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<TradingAccount | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Menu items with icons
  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <Home className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Bot Builder",
      to: "/bot-builder",
      icon: <Bot className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Charts",
      to: "/charts",
      icon: <LineChart className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Trading View",
      to: "/trading-view",
      icon: <LineChart className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Free Bots",
      to: "/bots",
      icon: <BarChart2 className="w-8 h-8" />,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Analysis Tool",
      to: "/analysis",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "EliteSpeed Bots",
      to: "#/elitespeed-bots",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
    },
    {
      label: "DTrader",
      to: "/dtrader",
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Copy Trading",
      to: "/copy-trading",
      icon: <Users className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600",
    },
  ];

  // Process accounts from localStorage
  const processAccounts = (storedAccounts: Account[]) => {
    const processedAccounts: TradingAccount[] = storedAccounts.map(
      (account, index) => {
        // Determine account type based on accountId presence and format
        const isRealAccount = account.accountId && account.accountId.length > 0;
        const accountType = isRealAccount ? "real" : "demo";

        // Generate loginid if not provided
        const loginid =
          account.accountId || `D${(index + 1).toString().padStart(7, "0")}`;

        // Set appropriate balance based on account type
        const balance = accountType === "real" ? 1000 : 10000;

        return {
          ...account,
          loginid,
          balance,
          isActive: index === 0, // First account is active by default
          accountType,
        };
      }
    );

    setTradingAccounts(processedAccounts);

    // Set active account
    const active =
      processedAccounts.find((acc) => acc.isActive) ||
      processedAccounts[0] ||
      null;
    setActiveAccount(active);
  };

  const refreshBalances = async () => {
    setRefreshing(true);
    // Simulate API call to refresh balances
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update balances with random variations for demo
    const updatedAccounts = tradingAccounts.map((acc) => ({
      ...acc,
      balance:
        acc.accountType === "real"
          ? 1000 + Math.random() * 500 - 250 // Real accounts: $750-$1250
          : 10000 + Math.random() * 2000 - 1000, // Demo accounts: $9000-$11000
    }));

    setTradingAccounts(updatedAccounts);

    // Update active account
    if (activeAccount) {
      const updatedActive = updatedAccounts.find(
        (acc) => acc.loginid === activeAccount.loginid
      );
      setActiveAccount(updatedActive || null);
    }

    setRefreshing(false);
  };

  const switchAccount = (loginid: string) => {
    const updatedAccounts = tradingAccounts.map((acc) => ({
      ...acc,
      isActive: acc.loginid === loginid,
    }));

    const newActiveAccount = updatedAccounts.find(
      (acc) => acc.loginid === loginid
    );
    setTradingAccounts(updatedAccounts);
    setActiveAccount(newActiveAccount || null);

    // Store active account in localStorage
    localStorage.setItem("active_deriv_account", loginid);
  };

  const getTotalBalance = () => {
    return tradingAccounts.reduce((total, acc) => total + acc.balance, 0);
  };

  const getRealAccounts = () => {
    return tradingAccounts.filter((acc) => acc.accountType === "real");
  };

  const getDemoAccounts = () => {
    return tradingAccounts.filter((acc) => acc.accountType === "demo");
  };

  useEffect(() => {
    const storedAccounts = localStorage.getItem("deriv_accounts");
    const storedActiveAccount = localStorage.getItem("active_deriv_account");

    if (storedAccounts) {
      try {
        const parsedAccounts: Account[] = JSON.parse(storedAccounts);
        setAccounts(parsedAccounts);
        processAccounts(parsedAccounts);

        // Restore active account after processing
        if (storedActiveAccount) {
          setTimeout(() => {
            switchAccount(storedActiveAccount);
          }, 100);
        }
      } catch (err) {
        console.error("Failed to parse accounts", err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-600 mt-1">
                Manage your trading accounts and tools
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              {accounts.length > 0 ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                    <p className="text-sm text-blue-800">
                      Total Balance:{" "}
                      <span className="font-semibold">
                        ${getTotalBalance().toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={refreshBalances}
                    disabled={refreshing}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      <Link
                        to="/login"
                        className="font-semibold hover:underline"
                      >
                        Log in
                      </Link>{" "}
                      to view your account balances
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Accounts Section */}
        {accounts.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Accounts
              </h2>
              {activeAccount && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Active Account:</span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {activeAccount.loginid}
                  </span>
                </div>
              )}
            </div>

            {/* Real Accounts */}
            {getRealAccounts().length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Real Accounts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getRealAccounts().map((account) => (
                    <AccountCard
                      key={account.loginid}
                      account={account}
                      activeAccount={activeAccount}
                      onSwitchAccount={switchAccount}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Demo Accounts */}
            {getDemoAccounts().length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Demo Accounts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getDemoAccounts().map((account) => (
                    <AccountCard
                      key={account.loginid}
                      account={account}
                      activeAccount={activeAccount}
                      onSwitchAccount={switchAccount}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="bg-white border border-gray-300 rounded-xl p-8 text-center">
              <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Trading Accounts
              </h3>
              <p className="text-gray-600 mb-4">
                Connect your Deriv account to start trading and access all
                features.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Connect Deriv Account
              </Link>
            </div>
          </section>
        )}

        {/* Trading Tools Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Trading Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="group bg-white border border-gray-300 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-blue-400 transition-all duration-200 transform hover:scale-105"
              >
                <div
                  className={`bg-gradient-to-r ${item.color} rounded-lg p-3 mb-3 group-hover:shadow-md transition-shadow`}
                >
                  <div className="w-8 h-8 text-white flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </span>
                <div className="mt-2 w-0 group-hover:w-4 h-0.5 bg-blue-600 transition-all duration-200"></div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats Section */}
        {accounts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-300 rounded-xl p-5">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-2 mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Account</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {activeAccount?.loginid || "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-5">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 mr-4">
                  <BarChart2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {activeAccount?.accountType || "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-xl p-5">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Accounts</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tradingAccounts.length}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

// Separate Account Card Component for better organization
function AccountCard({
  account,
  activeAccount,
  onSwitchAccount,
}: {
  account: TradingAccount;
  activeAccount: TradingAccount | null;
  onSwitchAccount: (loginid: string) => void;
}) {
  const isActive = activeAccount?.loginid === account.loginid;

  return (
    <div
      className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all duration-200 ${
        isActive
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-300 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            account.accountType === "real"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {account.accountType === "real" ? "Real" : "Demo"}
        </span>
        <div
          className={`w-3 h-3 rounded-full ${
            isActive
              ? "bg-blue-500"
              : account.accountType === "real"
              ? "bg-green-500"
              : "bg-orange-500"
          }`}
        ></div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          $
          {account.balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-sm text-gray-600">
          {account.currency || "USD"} Account
        </p>
        <p className="text-xs text-gray-500 font-mono truncate">
          {account.loginid}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {!isActive ? (
          <button
            onClick={() => onSwitchAccount(account.loginid)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Switch to this account
          </button>
        ) : (
          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
            Trade Now
          </button>
        )}
      </div>
    </div>
  );
}
