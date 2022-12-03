# Advent of Code Private Leaderboard Discord Bot

A self-hosted discord bot to show your private Advent of Code leaderboards on your discord servers

## Setup

1. Clone

```sh
git clone https://github.com/kavinvalli/aoc-private-lb-discord-bot.git
```

2. Install dependencies

```sh
npm install
```

3. Setup environment variables
    1. App Name could be anything (optional)
    2. Get your DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID from [here](https://discord.com/developers/applications). More details [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
    3. For SESSION, follow the following steps.
        1. Go to the [Private Leaderboards Page](https://adventofcode.com/2022/leaderboard/private) on adventofcode.com.
        2. Click on **View** on the leaderboard you want the discord bot to run for.
        3. Click on **API**, then click on **JSON**.
        4. Now, right click on the page and click on **Inspect**.
        5. Go to the **Network** tab.
        6. Refresh the page.
        7. On the table, click on the one which has a name ending in `.json` and type as `document`.
        8. Scroll down, and in the **Request Headers** section, you will find a field that says `cookie`. Copy everything after `session=` and that is your SESSION.
    4. PRIVATE_LEADERBOARD_ID: In step 3, after clicking on **JSON**, you visit a page. The URL would look something like this: `https://adventofcode.com/2022/leaderboard/private/view/1234567.json`. Here 1234567 is the PRIVATE_LEADERBOARD_ID.

4. Run the App
   1. Development mode
   ```sh
   npm run dev
   ```
   2. Normal Start
   ```sh
   npm start
   ```
   3. Build the application. The build files will be in the `dist/` folder.
   ```sh
   npm run build
   ```

## Deployment

To deploy the app on an EC2, GCP Instance, etc. use [pm2](https://pm2.keymetrics.io/).

1. Build the app using `npm run build`.
2. Start the pm2 process.

```sh
pm2 start dist/index.js --name aoc-private-lb-discord-bot # Replace aoc-private-lb-discord-bot with whatever you want to name the process (this is only for reference)
```
