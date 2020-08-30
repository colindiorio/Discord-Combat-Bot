const Discord = require('discord.js');
const coins = require('../data/coins.json');

module.exports.run = async (bot, message, args) => {
  await message.delete();
  let targetUser = message.author;

  // Checks if there is a target
  const target = message.mentions.members.first();
  if (target) targetUser = target.user;

  // Get all the data
  const wins = (coins[targetUser.id] && coins[targetUser.id].wins) || 0;
  const losses = (coins[targetUser.id] && coins[targetUser.id].losses) || 0;
  let gCoins = (coins[targetUser.id] && coins[targetUser.id].gainedCoins) || 0;
  let lCoins = (coins[targetUser.id] && coins[targetUser.id].lostCoins) || 0;

  // Convert to millions
  if (gCoins > 999999) gCoins = `${(gCoins / 1000000).toFixed(2)}M`;
  if (lCoins > 999999) lCoins = `${(lCoins / 1000000).toFixed(2)}M`;

  // Creates embeded message
  const profileEmbed = new Discord.RichEmbed()
    .setAuthor(targetUser.username, targetUser.avatarURL)
    .setColor('#64a4ff')
    .addField('Wins / Losses', `${wins} / ${losses}`, true)
    .addField('Total Coins Gained', gCoins.toLocaleString(), true)
    .addField('Total Coins Lost', lCoins.toLocaleString(), true);

  // Sends message then deletes it in 15 seconds (15 * 1000)
  return message.channel.send(profileEmbed).then(m => m.delete(15000)
    .catch(err => {}));
};

// This is where it gets the command to process in chat (!coins)
module.exports.help = {
  name: 'profile'
};
