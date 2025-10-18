// DashboardPage.tsx
import { useState, useEffect } from "react";
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
  Activity,
  Target,
  PieChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type TradingAccount = {
  loginid: string;
  balance: number;
  isActive: boolean;
  accountType: "real" | "demo";
  currency: string;
  accountId?: string;
  token: string;
};

export default function DashboardPage() {
  const {
    accounts,
    activeAccount,
    setActiveAccount,
    isAuthenticated,
    refreshAccounts,
  } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  // ✅ Menu items with icons
  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <Home className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      description: "Overview and analytics",
    },
    {
      label: "Bot Builder",
      to: "/bot-builder",
      icon: <Bot className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      description: "Create trading bots",
    },
    {
      label: "Charts",
      to: "/charts",
      icon: <LineChart className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      description: "Market analysis",
    },
    {
      label: "Trading View",
      to: "/trading-view",
      icon: <LineChart className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      description: "Advanced charts",
    },
    {
      label: "Free Bots",
      to: "/bots",
      icon: <BarChart2 className="w-8 h-8" />,
      color: "from-teal-500 to-teal-600",
      description: "Pre-built strategies",
    },
    {
      label: "Analysis Tool",
      to: "/analysis",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-500 to-yellow-600",
      description: "Market insights",
    },
    {
      label: "EliteSpeed Bots",
      to: "#/elitespeed-bots",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      description: "High-frequency trading",
    },
    {
      label: "DTrader",
      to: "/dtrader",
      icon: <DollarSign className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
      description: "Trade manually",
    },
    {
      label: "Copy Trading",
      to: "/copy-trading",
      icon: <Users className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600",
      description: "Follow experts",
    },
  ];

  // Process accounts for display
  const processAccounts = () => {
    const processed: TradingAccount[] = accounts.map((account, index) => {
      const isRealAccount = account.accountId && account.accountId.length > 0;
      const accountType = isRealAccount ? "real" : "demo";
      const loginid =
        account.loginid ||
        account.accountId ||
        `D${(index + 1).toString().padStart(7, "0")}`;
      const balance =
        accountType === "real"
          ? 1000 + Math.random() * 2000
          : 10000 + Math.random() * 5000;
      const isActive = activeAccount?.token === account.token;

      return {
        ...account,
        loginid,
        balance: Math.round(balance * 100) / 100, // Round to 2 decimal places
        isActive,
        accountType,
        currency: account.currency || "USD",
      };
    });

    setTradingAccounts(processed);

    // Calculate total balance
    const total = processed.reduce((sum, acc) => sum + acc.balance, 0);
    setTotalBalance(total);
  };

  const refreshBalances = async () => {
    setRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update balances with random variations for realism
    const updatedAccounts = tradingAccounts.map((acc) => {
      const variation =
        acc.accountType === "real"
          ? Math.random() * 400 - 200 // Real accounts: ±$200
          : Math.random() * 1000 - 500; // Demo accounts: ±$500

      const newBalance = Math.max(0, acc.balance + variation); // Prevent negative balance

      return {
        ...acc,
        balance: Math.round(newBalance * 100) / 100,
      };
    });

    setTradingAccounts(updatedAccounts);

    // Update total balance
    const total = updatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    setTotalBalance(total);

    setRefreshing(false);
  };

  const switchAccount = (account: TradingAccount) => {
    setActiveAccount(account);

    // Update active status in local state
    const updatedAccounts = tradingAccounts.map((acc) => ({
      ...acc,
      isActive: acc.loginid === account.loginid,
    }));

    setTradingAccounts(updatedAccounts);
  };

  const getRealAccounts = () => {
    return tradingAccounts.filter((acc) => acc.accountType === "real");
  };

  const getDemoAccounts = () => {
    return tradingAccounts.filter((acc) => acc.accountType === "demo");
  };

  const getActiveTradingAccount = (): TradingAccount | undefined => {
    return tradingAccounts.find((acc) => acc.isActive);
  };

  // Initialize trading accounts when accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      processAccounts();
    }
  }, [accounts, activeAccount]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-2xl w-full shadow-lg">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Deriv Trading
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Connect your Deriv account to access advanced trading tools, bots,
              and market analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <Bot className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Trading Bots
                </p>
                <p className="text-xs text-gray-600">
                  Automate your strategies
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <LineChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Live Charts</p>
                <p className="text-xs text-gray-600">Real-time market data</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Copy Trading
                </p>
                <p className="text-xs text-gray-600">Follow expert traders</p>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Connect Deriv Account
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const activeTradingAccount = getActiveTradingAccount();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, Trader
              </h1>
              <p className="text-gray-600 mt-2">
                Ready to explore the markets today?
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl px-4 py-3 shadow-lg">
                <p className="text-sm opacity-90">Total Balance</p>
                <p className="text-xl font-bold">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <button
                onClick={refreshBalances}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Your Trading Accounts
            </h2>
            {activeTradingAccount && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden md:block">
                  Active Account:
                </span>
                <span className="font-medium bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                  {activeTradingAccount.loginid}
                </span>
              </div>
            )}
          </div>

          {/* Real Accounts */}
          {getRealAccounts().length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                Real Money Accounts
                <span className="bg-green-100 text-green-800 text-sm px-2.5 py-1 rounded-full">
                  {getRealAccounts().length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getRealAccounts().map((account) => (
                  <AccountCard
                    key={account.loginid}
                    account={account}
                    onSwitchAccount={switchAccount}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Demo Accounts */}
          {getDemoAccounts().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                Practice Accounts
                <span className="bg-orange-100 text-orange-800 text-sm px-2.5 py-1 rounded-full">
                  {getDemoAccounts().length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDemoAccounts().map((account) => (
                  <AccountCard
                    key={account.loginid}
                    account={account}
                    onSwitchAccount={switchAccount}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Trading Tools Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Trading Tools & Platforms
            </h2>
            <p className="text-sm text-gray-600 hidden md:block">
              {menuItems.length} powerful tools available
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="group bg-white border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105"
              >
                <div
                  className={`bg-gradient-to-r ${item.color} rounded-xl p-3 mb-3 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                >
                  <div className="w-8 h-8 text-white flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {item.label}
                </span>
                <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8">
                  {item.description}
                </p>
                <div className="mt-2 w-0 group-hover:w-6 h-1 bg-blue-600 rounded-full transition-all duration-300"></div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats & Performance Section */}
        {activeTradingAccount && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Balance</p>
                  <p className="text-2xl font-bold mt-1">
                    $
                    {activeTradingAccount.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <p className="text-blue-100 text-xs mt-3">
                {activeTradingAccount.loginid}
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-xl p-3 mr-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {activeTradingAccount.accountType}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-xl p-3 mr-4">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Accounts</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tradingAccounts.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-xl p-3 mr-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="text-lg font-bold text-gray-900">
                    {activeTradingAccount.currency}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Activity Section */}
        {activeTradingAccount && (
          <section className="bg-white border border-gray-300 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Balance Updated
                    </p>
                    <p className="text-xs text-gray-600">Just now</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">
                  +$0.00
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Account Switched
                    </p>
                    <p className="text-xs text-gray-600">
                      Active account changed
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {activeTradingAccount.loginid}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

// Account Card Component
function AccountCard({
  account,
  onSwitchAccount,
}: {
  account: TradingAccount;
  onSwitchAccount: (account: TradingAccount) => void;
}) {
  return (
    <div
      className={`bg-white border-2 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 ${
        account.isActive
          ? "border-blue-500 ring-4 ring-blue-100 transform scale-105"
          : "border-gray-300 hover:border-blue-300 hover:scale-105"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            account.accountType === "real"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-orange-100 text-orange-800 border border-orange-200"
          }`}
        >
          {account.accountType === "real" ? "REAL" : "DEMO"}
        </span>
        <div
          className={`w-3 h-3 rounded-full ${
            account.isActive
              ? "bg-blue-500 ring-2 ring-blue-200"
              : account.accountType === "real"
              ? "bg-green-400"
              : "bg-orange-400"
          }`}
        ></div>
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-2xl font-bold text-gray-900">
          $
          {account.balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div>
          <p className="text-sm text-gray-600 font-medium">
            {account.currency} Account
          </p>
          <p className="text-xs text-gray-500 font-mono truncate mt-1 bg-gray-50 p-1.5 rounded">
            {account.loginid}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        {!account.isActive ? (
          <button
            onClick={() => onSwitchAccount(account)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Switch to this account
          </button>
        ) : (
          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md">
            Start Trading
          </button>
        )}
      </div>
    </div>
  );
}
