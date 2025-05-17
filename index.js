const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  const channelId = "YOUR_CHANNEL_ID";

  // Post every hour
  cron.schedule("0 * * * *", () => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      channel.send("Hourly update from bot!");
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
