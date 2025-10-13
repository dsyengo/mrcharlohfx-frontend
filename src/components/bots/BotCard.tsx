import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot } from "@/hooks/useBots";
import { Youtube, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BotCardProps = {
  bot: Bot;
  onLoadBot: (bot: Bot) => void;
};

export default function BotCard({ bot, onLoadBot }: BotCardProps) {
  const navigate = useNavigate();

  // Render star ratings dynamically
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {halfStar && <Star className="w-4 h-4 text-yellow-400 opacity-70" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-blue-700 font-semibold">
          {bot.name}
        </CardTitle>
        <p className="text-sm text-gray-600">{bot.category} Bot</p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 text-sm mb-2">{bot.description}</p>
        {renderStars(bot.rating)}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => onLoadBot(bot)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Load Bot
        </Button>
        {bot.youtubeUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(bot.youtubeUrl, "_blank")}
          >
            <Youtube className="w-4 h-4 mr-1 text-red-600" /> Watch
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
