import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

if (
  !process.env.DISCORD_BOT_TOKEN ||
  !process.env.DISCORD_CLIENT_ID ||
  !process.env.SESSION ||
  !process.env.PRIVATE_LEADERBOARD_ID
) {
  console.error(
    'Set env variables properly. Copy .env.example into .env and fill all the values.'
  );
  process.exit(1);
}

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

class DClient extends Client {
  public commands: Collection<unknown, Command> = new Collection();
}

const client = new DClient({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const command = {
  data: new SlashCommandBuilder()
    .setName('lb')
    .setDescription(
      'Shows private leaderboard' +
        (process.env.appName ? ` of ${process.env.appName}` : '')
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const data: {
        members: Record<string, { name: string; local_score: number }>;
      } = await (
        await fetch(
          `https://adventofcode.com/2022/leaderboard/private/view/${process.env.PRIVATE_LEADERBOARD_ID}.json`,
          {
            headers: {
              'Content-Type': 'application/json',
              Cookie: 'session=' + process.env.SESSION,
              'User-Agent':
                'github.com/kavinvalli/aoc-private-lb-discord-bot by mail@kavin.me',
            },
          }
        )
      ).json();
      let members: {
        name: string;
        local_score: number;
      }[] = [];
      for (const key in data.members) {
        members.push(data.members[key]);
      }
      members.sort((a, b) => b.local_score - a.local_score);
      members = members.slice(0, Math.max(10, members.length));
      const replyEmbed = new EmbedBuilder()
        .setTitle("techCircuit's AOC Leaderboard")
        .setDescription(
          `Want to view more than the top 10 users? [**Click here**](https://adventofcode.com/2022/leaderboard/private/view/${process.env.PRIVATE_LEADERBOARD_ID})\n(you need to be logged in and have joined the leaderboard to view the above link)` +
            '\n\n' +
            members
              .map(
                (member, index) =>
                  `**${index + 1}. ${member.name} - ${member.local_score}**`
              )
              .join('\n')
        );
      interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Something went wrong');
    }
  },
};

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = (interaction.client as DClient).commands.get(
    interaction.commandName
  );

  if (!command) {
    console.error(`No command matching`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply('Something went wrong...');
  }
});

client.commands.set('lb', command);

const rest = new REST({ version: '10' }).setToken(
  process.env.DISCORD_BOT_TOKEN ?? ''
);

const commands = client.commands;

(async () => {
  try {
    console.log(`Started refreshing application (/) commands.`);

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID ?? ''),
      { body: commands.map(command => command.data.toJSON()) }
    );
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.DISCORD_BOT_TOKEN);
