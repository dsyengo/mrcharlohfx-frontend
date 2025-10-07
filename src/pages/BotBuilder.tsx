import Layout from "../layouts/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function BotBuilder() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">Bot Builder</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-red-300 text-red-600 hover:bg-red-50">
          Back to Dashboard
        </Button>
      </div>
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-blue-800/80">Visual builder coming soon. Customize logic, blocks, and strategy parameters.</p>
      </div>
    </Layout>
  );
}


