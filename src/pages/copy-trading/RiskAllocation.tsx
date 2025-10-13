import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function RiskAllocation({
  allocation,
  setAllocation,
  onStart,
  onStop,
}: {
  allocation: number[];
  setAllocation: (val: number[]) => void;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Allocate capital for this trader: <b>{allocation[0]} USD</b>
        </p>
        <Slider
          value={allocation}
          onValueChange={setAllocation}
          min={1}
          max={100}
          step={1}
        />
        <div className="flex gap-3 pt-3">
          <Button onClick={onStart} className="bg-green-600 hover:bg-green-700">
            Start Copying
          </Button>
          <Button
            variant="destructive"
            onClick={onStop}
            className="bg-red-600 hover:bg-red-700"
          >
            Stop Copying
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
