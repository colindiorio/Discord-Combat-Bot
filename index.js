const Discord = require('discord.js');
const { token, prefix } = require('./data/config.json');
const bot = new Discord.Client();
const fs = require('fs');
const coins = require('./data/coins.json');
bot.commands = new Discord.Collection();

// Repeating task that starts when the bot is ready
bot.on('ready', () => {
  console.log(bot.user.username + ' is online.');
  bot.user.setActivity('the fights', { type: 'WATCHING' });

  // Repeating task on a 10 minute interval (10 * 60 * 1000)
  bot.setInterval(async function giveCoins () {
    // Gets my servers channels
    bot.guilds.forEach(async function (guild) {
    // var channels = bot.guilds.get("402527069029793807").channels;
      guild.channels.forEach(async function (channel) {
      // Checks if its a voice channel
        if (channel.type === 'voice') {
          var members = channel.members;
          members.forEach(async function (member) {
          // Checks if there are coins saved for the user + update if not
            if (member.user.bot) return;
            if (!coins[member.user.id]) {
              coins[member.user.id] = {
                coins: 0
              };
            }

            // Create the random money amount
            const reward = Math.floor(Math.random() * 50000) + 5000;

            // Update the coins amount + username
            coins[member.user.id].coins = !coins[member.user.id].coins ? reward : coins[member.user.id].coins + reward;
            coins[member.user.id].username = member.user.username;

            // Save the new coin amount
            fs.writeFile('./data/coins.json', JSON.stringify(coins), (err) => {
              if (err) console.log(err);
            });
          });
        }
      });
    });
  }, 300000);
});

// Load all commands
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);

  const jsfile = files.filter(f => f.endsWith('.js'));

  if (jsfile.length <= 0) {
    return console.log("Couldn't find commands.");
  }

  jsfile.forEach((f, i) => {
    const props = require(`./commands/${f}`);

    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on('message', async message => {
  // a little bit of data parsing/general checks
  if (message.author.bot || message.channel.type === 'dm' || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // checks if message contains a command and runs it
  const commandfile = bot.commands.get(commandName);
  if (commandfile) commandfile.run(bot, message, args);
});

bot.login(token);
