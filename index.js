const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
const fetch = require("node-fetch");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = "YOUR_CHANNEL_ID"; // Replace this with your actual channel ID

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  cron.schedule("* * * * *", async () => {
    try {
      const response = await fetch(
        "https://raongames.com/growcastle/restapi/season/now/players"
      );
      const data = await response.json();

      if (!data || !data.result || !data.result.list) {
        console.error("Invalid data format");
        return;
      }

      const topPlayers = data.result.list.slice(0, 10); // Show only top 10 for now

      let message = `🏆 **Top 10 Players - ${new Date().toLocaleTimeString()}**\n`;
      topPlayers.forEach((player, index) => {
        message += `${index + 1}. **${player.name}** - ${player.score}\n`;
      });

      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        await channel.send(message);
      } else {
        console.error("Channel not found");
      }
    } catch (err) {
      console.error("Error fetching or sending data:", err);
    }
  });
});

client.login(TOKEN);
