const Discord = require('discord.js');
const coins = require('../data/coins.json');

module.exports.run = async (bot, message, args) => {
  await message.delete();
  if (!coins) return;

  const leaderboard = [];

  // Adds all the values from the JSON file to the array
  for (const id in coins) {
    const item = coins[id];

    leaderboard.push({
      coins: item.coins,
      username: item.username,
      id: id
    });
  }

  // Sorts the array in decending order
  leaderboard.sort((a, b) => b.coins - a.coins);

  const topEmbed = new Discord.RichEmbed();
  const emojis = [':partying_face:', ':triumph:', ':smirk:', ':heart:',
    ':orange_heart:', ':yellow_heart:', ':green_heart:', ':blue_heart:',
    ':purple_heart:', ':white_heart:'];
  let onList = false;

  // Iterates through the new array up to 10 times
  for (let i = 0; i < leaderboard.length && i < 10; i++) {
    const currentUser = leaderboard[i];
    const found = currentUser.id === message.author.id;
    const name = found ? `\`${currentUser.username}\`` +
      '  :point_left: :sunglasses:' : currentUser.username;

    if (found) onList = true;

    topEmbed.addField(`${emojis[i]} #${i + 1} ${name}`,
      `**Gold:** ${leaderboard[i].coins.toLocaleString()}`);
  }

  if (!onList) {
    const index = leaderboard.findIndex(e => e.id === message.author.id);

    if (index !== -1) {
      topEmbed.addField(`:black_heart: #${index + 1} ` +
        `\`${message.author.username}\`  :point_left: :pleading_face:`,
        `**Gold:** ${leaderboard[index].coins.toLocaleString()}`);
    }
  }

  // Show leaderboard to message
  return message.channel.send(topEmbed).then(m => m.delete(15000)
    .catch(err => {}));
};

// This is where it gets the command to process in chat (!top)
module.exports.help = {
  name: 'top'
};
