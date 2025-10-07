import { useState } from "react";
import Layout from "../layouts/Layout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Upload, Bot, Zap, BarChart3, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export default function Dashboard() {
  const [notifications] = useState<string[]>([
    "Your bot executed 3 trades successfully.",
    "New strategy templates added.",
    "Copy trading beta is live.",
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(
    localStorage.getItem("deriv_disclaimer_ack") !== "1"
  );

  const onAcknowledgeDisclaimer = () => {
    localStorage.setItem("deriv_disclaimer_ack", "1");
    setShowDisclaimer(false);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // simulate success then redirect
      setTimeout(() => (window.location.href = "/bot-builder"), 800);
      alert("Bot uploaded successfully!");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Dashboard</h1>
          <p className="text-blue-800/80">Manage bots, strategies, and insights.</p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-blue-50" onClick={() => setNotifOpen(!notifOpen)}>
          <Bell className="text-blue-700" />
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4 text-center">
            {notifications.length}
          </span>
        </button>
      </div>

      {notifOpen && (
        <div className="relative">
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow p-3">
            <p className="text-sm font-semibold text-blue-800 mb-2">Notifications</p>
            <div className="space-y-1">
              {notifications.map((n) => (
                <div key={n} className="text-blue-800 text-sm rounded-lg px-2 py-1 hover:bg-green-50">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card className="p-6 text-center hover:shadow-md transition">
          <Upload className="mx-auto text-green-600 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Upload Bot</h3>
          <p className="text-sm text-blue-800/80 mb-3">Import your .xml/.json bot</p>
          <input type="file" accept=".xml,.json" id="botUpload" className="hidden" onChange={onUpload} />
          <label htmlFor="botUpload" className="cursor-pointer inline-block">
            <Button variant="secondary">Upload File</Button>
          </label>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition cursor-pointer" onClick={() => (window.location.href = "/bot-builder")}> 
          <Bot className="mx-auto text-green-600 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Bot Builder</h3>
          <p className="text-sm text-blue-800/80">Create and test visually</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition">
          <Zap className="mx-auto text-blue-700 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Quick Strategy</h3>
          <p className="text-sm text-blue-800/80">1-click presets</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-md transition">
          <BarChart3 className="mx-auto text-blue-700 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Analysis Tool</h3>
          <p className="text-sm text-blue-800/80">Visual insights</p>
        </Card>
      </section>

      <button
        className="fixed bottom-6 left-6 px-4 py-2 rounded-xl bg-green-600 text-white border border-red-300 hover:bg-green-700"
        onClick={() => setShowDisclaimer(true)}
      >
        Risk Disclaimer
      </button>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risk Disclaimer</DialogTitle>
          </DialogHeader>
          <p className="text-blue-800/80 mt-2">
            Trading Deriv products carries a high level of risk and may not be suitable for all clients.
            You may lose all your invested capital. Please ensure that you understand the risks involved.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onAcknowledgeDisclaimer}>I Understand</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}


