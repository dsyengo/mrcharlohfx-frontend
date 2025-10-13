import { Button } from "@/components/ui/button";

type BotFilterProps = {
  filter: "All" | "Elite" | "AI Elite";
  setFilter: (value: "All" | "Elite" | "AI Elite") => void;
};

export default function BotFilter({ filter, setFilter }: BotFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {["All", "Elite", "AI Elite"].map((cat) => (
        <Button
          key={cat}
          variant={filter === cat ? "default" : "outline"}
          onClick={() => setFilter(cat as "All" | "Elite" | "AI Elite")}
          className="capitalize"
        >
          {cat} Bots
        </Button>
      ))}
    </div>
  );
}
