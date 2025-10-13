import { Bot } from "@/hooks/useBots";
import BotCard from "./BotCard";

type BotListProps = {
  bots: Bot[];
  onLoadBot: (bot: Bot) => void;
};

export default function BotList({ bots, onLoadBot }: BotListProps) {
  if (bots.length === 0)
    return <p className="text-center text-gray-500">No bots available.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot) => (
        <BotCard key={bot.id} bot={bot} onLoadBot={onLoadBot} />
      ))}
    </div>
  );
}
