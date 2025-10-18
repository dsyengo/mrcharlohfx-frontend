import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Account = {
  accountId?: string;
  currency?: string;
  token: string;
  loginid?: string;
};

type AuthContextType = {
  accounts: Account[];
  activeAccount: Account | null;
  setActiveAccount: (account: Account) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAccounts: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccounts = () => {
    const storedAccounts = localStorage.getItem("deriv_accounts");
    const storedActiveAccount = localStorage.getItem("active_deriv_account");

    if (storedAccounts) {
      try {
        const parsedAccounts: Account[] = JSON.parse(storedAccounts);
        setAccounts(parsedAccounts);

        // Set active account
        if (storedActiveAccount) {
          const active = parsedAccounts.find(
            (acc) =>
              acc.accountId === storedActiveAccount ||
              acc.loginid === storedActiveAccount
          );
          setActiveAccount(active || parsedAccounts[0] || null);
        } else if (parsedAccounts.length > 0) {
          setActiveAccount(parsedAccounts[0]);
        }
      } catch (err) {
        console.error("Failed to parse accounts", err);
      }
    }
    setIsLoading(false);
  };

  const handleSetActiveAccount = (account: Account) => {
    setActiveAccount(account);
    const loginid = account.accountId || account.loginid;
    if (loginid) {
      localStorage.setItem("active_deriv_account", loginid);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const value = {
    accounts,
    activeAccount,
    setActiveAccount: handleSetActiveAccount,
    isAuthenticated: accounts.length > 0,
    isLoading,
    refreshAccounts: loadAccounts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
