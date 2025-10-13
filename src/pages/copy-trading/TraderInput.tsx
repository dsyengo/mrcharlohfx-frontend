import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function TraderInput({
  traderId,
  setTraderId,
  onFetch,
  loading,
}: {
  traderId: string;
  setTraderId: (id: string) => void;
  onFetch: () => void;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Trader ID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Input
            placeholder="e.g., CR123456"
            value={traderId}
            onChange={(e) => setTraderId(e.target.value)}
            className="w-full md:w-1/2"
          />
          <Button onClick={onFetch} disabled={!traderId}>
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Fetching...
              </>
            ) : (
              "Fetch Trader Data"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
