import Layout from "@/layouts/Layout";
import BotList from "@/components/bots/BotList";
import BotFilter from "@/components/bots/BotFilter";
import { useBots } from "@/hooks/useBots";
import { Bot } from "@/hooks/useBots";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function FreeBots() {
  const { bots, setFilter, filter } = useBots();
  const navigate = useNavigate();

  const handleLoadBot = async (bot: Bot) => {
    try {
      const response = await fetch(bot.filePath);
      if (!response.ok) throw new Error("Failed to fetch bot file");
      const fileContent = await response.text();

      // Save the bot content for the builder
      localStorage.setItem("imported_bot", fileContent);
      localStorage.setItem("imported_bot_name", bot.name);

      toast({
        title: "Bot Loaded",
        description: `${bot.name} has been loaded into the builder.`,
      });

      // Navigate to bot builder page
      navigate("/bot-builder");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          "Failed to load bot. Please check the file path or try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Free Bots Collection
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Browse and load free Deriv bots. Filter by category or watch tutorials
          to learn how to use them.
        </p>

        <BotFilter filter={filter} setFilter={setFilter} />
        <BotList bots={bots} onLoadBot={handleLoadBot} />
      </section>
    </Layout>
  );
}
