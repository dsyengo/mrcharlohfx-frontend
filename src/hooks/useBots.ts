import { useEffect, useState } from "react";

export type Bot = {
  id: string;
  name: string;
  description: string;
  category: "Elite" | "AI Elite";
  filePath: string;
  youtubeUrl?: string;
  rating: number; // ⭐ new
};

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [filter, setFilter] = useState<"All" | "Elite" | "AI Elite">("All");

  useEffect(() => {
    import("../data/sampleBots.json").then((module) => setBots(module.default));
  }, []);

  const filteredBots =
    filter === "All" ? bots : bots.filter((b) => b.category === filter);

  return { bots: filteredBots, setFilter, filter };
}
